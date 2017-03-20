#!/bin/bash
source $HOME/.bashrc
nvm install
nvm use

exec "$@"
