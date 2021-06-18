FROM akorn/chromium-headless:alpine
USER root
RUN apk add --no-cache bash nodejs-current npm ffmpeg xvfb
RUN ln -s /usr/bin/chromium-browser /usr/bin/chromium-browser-unstable

RUN mkdir -p /app/
COPY media/video.mp4 /app/

ENV V 0099991

WORKDIR /app
COPY package.json yarn.lock observertc.js entrypoint.sh /app/
COPY scripts /app/scripts/
RUN npm install -g yarn
RUN yarn --production=true

COPY app.min.js* /app/
ENV DEBUG_LEVEL=WARN
ENTRYPOINT ["/app/entrypoint.sh"]

#ENTRYPOINT [ "/bin/bash", "-l", "-c" ]
