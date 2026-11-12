#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

# Nano S 1.5 SDK pinned by the historical theQRL/ledger-qrl repository.
APP_REV=b45f1854a032b31459dac715dde3b74b5edd2e6a
SDK_REV=273d2cd9c781141c3d4619b9ac968a5dcfc34297
BUILDER=zondax/ledger-docker-bolos@sha256:f4dfb66eef1b113351b1b0feb646969e80d61d386a2eef5d600b15e20a4eee83
EMULATOR=ghcr.io/ledgerhq/speculos@sha256:508361e1fea28e3b24ac7ae68d64cbc5737e058b44cdd07cfc51c4969e8777ef
WORK="$PWD/.speculos"
NAME="ledger-qrl-js-speculos-$$"
PORT="${SPECULOS_PORT:-5000}"
mkdir -p "$WORK"

cleanup() {
    docker logs "$NAME" > "$WORK/speculos.log" 2>&1 || true
    docker rm -f "$NAME" > /dev/null 2>&1 || true
}
trap cleanup EXIT

if [[ ! -d "$WORK/app/.git" ]]; then
    git clone https://github.com/theQRL/ledger-qrl-app.git "$WORK/app"
fi
if [[ ! -d "$WORK/sdk/.git" ]]; then
    git clone https://github.com/LedgerHQ/nanos-secure-sdk.git "$WORK/sdk"
fi
git -C "$WORK/app" checkout --detach "$APP_REV"
git -C "$WORK/sdk" checkout --detach "$SDK_REV"
# Enable only the app's diagnostic APDUs; leave mock seed and other flags off.
sed -i.bak 's/^#DEFINES   += TESTING_ENABLED$/DEFINES   += TESTING_ENABLED/' "$WORK/app/Makefile"

docker run --rm --platform linux/amd64 --entrypoint /bin/bash \
    -v "$WORK:/project" -w /project/app \
    -e BOLOS_SDK=/project/sdk -e BOLOS_ENV=/opt/bolos \
    "$BUILDER" -lc 'make -j2' > "$WORK/build.log" 2>&1 || {
    cat "$WORK/build.log"
    exit 1
}
docker run -d --platform linux/amd64 --name "$NAME" \
    -p "127.0.0.1:$PORT:5000" -v "$WORK/app/bin:/apps:ro" \
    "$EMULATOR" --model nanos --sdk 1.5 --display headless \
    --api-port 5000 /apps/app.elf > /dev/null

export SPECULOS_URL="http://127.0.0.1:$PORT"
export QRL_APP_VERSION=1.1.2
ready=false
for ((attempt=0; attempt<60; attempt++)); do
    if curl --fail --silent --max-time 2 "$SPECULOS_URL/events" > /dev/null; then
        ready=true
        break
    fi
    if [[ "$(docker inspect -f '{{.State.Running}}' "$NAME")" != true ]]; then
        docker logs "$NAME"
        exit 1
    fi
    sleep 1
done
if [[ "$ready" != true ]]; then
    echo 'Speculos did not become ready' >&2
    exit 1
fi
./node_modules/.bin/mocha --timeout 35000 tests/tests-node_basic.js tests/speculos.test.js
