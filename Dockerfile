FROM ubuntu:17.04

# use bash in place of sh
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Based on guidance at http://jdlm.info/articles/2016/03/06/lessons-building-node-app-docker.html
WORKDIR /cg-dashboard

# Install packages necessary for installing nvm
RUN apt-get update && apt-get install -y -q --no-install-recommends \
        build-essential \
        curl \
        libssl-dev \
        ca-certificates \
        python \
        python-dev \
    && rm -rf /var/lib/apt/lists/*

ENV NVM_DIR /cg-dashboard/.nvm

# Install nvm
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash

# Add nvm.sh to .bashrc for startup
RUN echo "source ${NVM_DIR}/nvm.sh" > /root/.bashrc

COPY ./docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]
