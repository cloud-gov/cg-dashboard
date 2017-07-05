FROM consol/ubuntu-xfce-vnc

USER 0
# need java for selenium
RUN apt-get update && apt-get install -y -q --no-install-recommends \
        default-jre \
    && rm -rf /var/lib/apt/lists/*

USER 0

# let's change the background picture.
COPY ./devtools/node/vnc_bg.png /headless/.config/bg_sakuli.png

ENV NVM_DIR $HOME/.nvm
# change this version.
ENV NODE_VERSION "v6.7.0"
ENV NODE_PATH "$NVM_DIR/versions/node/$NODE_VERSION/lib/node_modules"
ENV PATH "$NVM_DIR/versions/node/$NODE_VERSION/bin:$PATH"
