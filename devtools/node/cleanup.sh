#!/bin/bash

# We don't need this for regular development. only in the docker container.
npm install chokidar

node devtools/node/cleanup.js
