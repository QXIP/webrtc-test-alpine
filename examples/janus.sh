#!/bin/bash

if [ $# -eq 0 ]; then
    echo "No arguments provided!"
    exit 1
fi

RANDOM_UUID=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
STATS_COLLECTOR=$1
ROOM=$2
docker run -it --rm --name=webrtc-stress-test-publisher \
    -v /dev/shm:/dev/shm \
    -e VIDEO_PATH=/video.mp4 \
    -e URL="$ROOM" \
    -e SESSIONS=1 \
    -e TABS_PER_SESSION=1 \
    -e SHOW_STATS=false \
    -e DEBUG_LEVEL=TRACE \
    -e ENABLE_RTC_STATS=true \
    -e PASTASH_WSS="$STATS_COLLECTOR" \
    -e SCRIPT_PATH=/janus.js \
    -v $(pwd)/scripts/janus.js:/janus.js \
    -v /tmp/video.mp4:/video.mp4 \
    qxip/webrtc-test-alpine:latest
