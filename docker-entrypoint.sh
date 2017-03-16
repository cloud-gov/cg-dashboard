#!/bin/bash
source $HOME/.bashrc
nvm install
nvm use


echo $USER

exec "$@"
