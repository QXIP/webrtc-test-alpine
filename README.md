# WebRTC stress test
A tool for running concurrent WebRTC sessions using chromium web browser in headless mode.

Components used:
- NodeJS application.
- Puppeteer library for controlling chromium instances.
- RTC stats logging with [paStash](https://github.com/sipcapture/paStash).

## Configuration options

See the [config documentation](CONFIG.md).

The `DEBUG_LEVEL` environment is used for enabled debug messages; see [debug-level](https://github.com/commenthol/debug-level#readme) for syntax.

## Statistics

Example output:

```
-- Mon, 08 Mar 2021 11:41:48 GMT -------------------------------------------------------------------
                          name    count      sum     mean   stddev      25p      min      max
                           cpu        1    67.66    67.66     0.00    67.66    67.66    67.66 %
                        memory        1   801.13   801.13     0.00   801.13   801.13   801.13 MB
                          tabs        1        1        1        0        1        1        1
-- Inbound audio -----------------------------------------------------------------------------------
                      received        1     0.02     0.02     0.00     0.02     0.02     0.02 MB
                          rate        1     0.53     0.53     0.00     0.53     0.53     0.53 Kbps
                          lost        1              0.00     0.00     0.00     0.00     0.00 %
                        jitter        1              0.00     0.00     0.00     0.00     0.00 s
          avgJitterBufferDelay        1             85.27     0.00    85.27    85.27    85.27 ms
-- Inbound video -----------------------------------------------------------------------------------
                      received        2    26.62    13.31    13.22    13.31     0.09    26.53 MB
                          rate        2   838.72   419.36   411.30   419.36     8.06   830.66 Kbps
                          lost        1              0.00     0.00     0.00     0.00     0.00 %
                        jitter        1              1.88     0.37     1.77     0.98     2.65 s
          avgJitterBufferDelay        1             90.86     0.00    90.86    90.86    90.86 ms
                         width        1              1280        0     1280     1280     1280 px
                        height        1               720        0      720      720      720 px
-- Outbound audio ----------------------------------------------------------------------------------
                          sent        1     0.50     0.50     0.00     0.50     0.50     0.50 MB
                 retransmitted        1     0.00     0.00     0.00     0.00     0.00     0.00 MB
                          rate        1     0.00     0.00     0.00     0.00     0.00     0.00 Kbps
-- Outbound video ----------------------------------------------------------------------------------
                          sent        3    43.62    14.54     7.70    10.06     4.68    23.49 MB
                 retransmitted        3     0.00     0.00     0.00     0.00     0.00     0.00 MB
                          rate        3     0.00     0.00     0.00     0.00     0.00     0.00 Kbps
 qualityLimitResolutionChanges        3        0        0        0        0        0        0
                         width        1              1280        0     1280     1280     1280 px
                        height        1               720        0      720      720      720 px
                           fps        1                25        0       25       25       25 fps
```

Statistics values:

| Name                      | Count        | Desscription |
| :------------------------ | :----------- | :----------- |
| cpu                       | Total sessions | The browser process cpu usage. |
| memory                    | Total sessions | The browser process memory usage. |
| tabs                      | Total sessions | The browser current opened tabs. |
| received                  | Total inbound streams | The `bytesReceived` value for each stream. |
| sent                      | Total outbound streams | The `bytesSent` value for each stream. |
| retransmitted             | Total outbound streams | The `retransmittedBytesSent` value for each stream. |
| rate                      | Total streams | The stream bitrate. |
| lost                      | Total streams | The stream [lost packets](https://www.w3.org/TR/webrtc-stats/#dom-rtcreceivedrtpstreamstats-packetslost) %. |
| jitter                    | Total streams | The stream [jitter](https://www.w3.org/TR/webrtc-stats/#dom-rtcreceivedrtpstreamstats-jitter) in seconds. |
| avgJitterBufferDelay      | Total decoded tracks | The inbound average [jitter buffer delay](https://www.w3.org/TR/webrtc-stats/#dom-rtcinboundrtpstreamstats-jitterbufferdelay). |
| qualityLimitResolutionChanges   | Total outbound video streams | The `qualityLimitationResolutionChanges` [value](https://w3c.github.io/webrtc-stats/#dom-rtcoutboundrtpstreamstats-qualitylimitationresolutionchanges) for each outbound video stream. |
| width                     | Total sent or received videos | The sent or received video width. |
| height                    | Total sent or received videos | The sent or received video height. |
| fps                       | Total sent | The sent video frames per second. |

## Examples

See the 'examples' folder

### Mediasoup demo

Starts one send-receive participant:

```sh
docker pull qxip/webrtc-stress-test-pastash:latest
docker run -it --rm --name=webrtc-stress-test-publisher \
    -v /dev/shm:/dev/shm \
    -e VIDEO_PATH=/app/video.mp4 \
    -e URL=$MEDIASOUP_DEMO_URL \
    -e URL_QUERY='roomId=test&displayName=Publisher-$s-$t' \
    -e SESSIONS=1 \
    -e TABS_PER_SESSION=1 \
    -e SHOW_STATS=false \
    -e ENABLE_RTC_STATS=true \
    -e PASTASH_WSS='wss://pastash.collector:9090' \
    -e PASTASH_ID='my_test_123' \
    qxip/webrtc-stress-test-pastash:latest
```

Starts 10 receive-only participants:

```sh
docker pull qxip/webrtc-stress-test-pastash:latest
docker run -it --rm --name=webrtc-stress-test-viewer \
    -v /dev/shm:/dev/shm \
    -e URL=$MEDIASOUP_DEMO_URL \
    -e URL_QUERY='roomId=test&displayName=Viewer-$s-$t&produce=false' \
    -e SESSIONS=1 \
    -e TABS_PER_SESSION=10 \
    -e SHOW_STATS=false \
    -e ENABLE_RTC_STATS=true \
    -e PASTASH_WSS='wss://pastash.collector:9090' \
    -e PASTASH_ID='my_test_123' \
    qxip/webrtc-stress-test-pastash:latest
```

### Meething

Starts one send-receive participant, with a random id:

```sh
docker pull qxip/webrtc-stress-test-pastash:latest
docker run -it --rm --name=webrtc-stress-test-publisher \
    -v /dev/shm:/dev/shm \
    -e VIDEO_PATH=/app/video.mp4 \
    -e URL=$MEETHING_URL \
    -e SCRIPT_PATH=/app/scripts/meething.js \
    -e SESSIONS=1 \
    -e TABS_PER_SESSION=1 \
    -e SHOW_STATS=false \
    -e ENABLE_RTC_STATS=true \
    -e PASTASH_WSS='wss://pastash.collector:9090' \
    -e PASTASH_ID='my_test_123' \
    qxip/webrtc-stress-test-pastash:latest
```

### Jitsi

Starts one send-receive participant:

```sh
docker pull qxip/webrtc-stress-test-pastash:latest
docker run -it --rm --name=webrtc-stress-test-publisher \
    -v /dev/shm:/dev/shm \
    -e VIDEO_PATH=/app/video.mp4 \
    -e URL=$JITSI_ROOM_URL \
    -e URL_QUERY='#config.prejoinPageEnabled=false&userInfo.displayName=Participant-$s-$t' \
    -e SESSIONS=1 \
    -e TABS_PER_SESSION=1 \
    -e SHOW_STATS=false \
    -e ENABLE_RTC_STATS=true \
    -e PASTASH_WSS='wss://pastash.collector:9090' \
    -e PASTASH_ID='my_test_123' \
    qxip/webrtc-stress-test-pastash:latest
```


## Running from source code

```sh
git clone https://github.com/qxip/webrtc-stress-test-pastash.git

cd webrtc-stress-test

# build the chromium customized version
# cd chromium
# ./build.sh setup
# ./build.sh apply_patch
# ./build.sh build
# install the package (on Ubuntu/Debian)
# dpkg -i ./chromium-browser-unstable_<version>-1_amd64.deb
# cd ..

# sendrecv test
DEBUG_LEVEL=DEBUG:* yarn start:dev \
    --url=https://127.0.0.1:3443/test \
    --url-query='displayName=SendRecv $s/$S-$t/$T' \
    --video-path=./video.mp4 \
    --script-path=./scripts/edumeet-sendrecv.js \
    --sessions=1 \
    --tabs-per-session=1 \
    --enable-page-log=true

# recv only
DEBUG_LEVEL=DEBUG:* yarn start:dev \
    --url=https://127.0.0.1:3443/test \
    --url-query='displayName=Recv $s/$S-$t/$T' \
    --script-path=./scripts/edumeet-recv.js \
    --sessions=1 \
    --tabs-per-session=10 \
    --enable-page-log=true \
    --use-null-video-decoder=true
```

## Setup
Install pastash & the required plugins using npm
```
npm install -g @pastash/pastash @pastash/output_loki
```

---------------

## Pastash Collector Recipe
The following recipe will provide a websocket receiver for webRTC statistics on port `9090` and shipping to Grafana Loki
Create and store this on your filesystem, ie: `/some/path/to/pastash.conf` and add in your `grafana` account details:
```
input {
  ws {
    host => 0.0.0.0
    port => 9090
    ssl => true
    ssl_key => "/etc/letsencrypt/live/your.domain/privkey.pem"
    ssl_cert => "/etc/letsencrypt/live/your.domain/cert.pem"
  }
}

output {
  loki {
    basic_auth_password => "some_very_secure_password_hash_here"
    basic_auth_user => "1234"
    host => "logs-us-west1.grafana.net"
    port => 80
    path => "/api/prom/push"
  }
}
```

Once you're ready, run your paStash socket manually or using pm2

```
pastash --config_file=/some/path/to/pastash.conf
```


### Credits

* Based on [webrtc-stress-test](https://github.com/vpalmisano)
