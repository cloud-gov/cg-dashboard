#! /bin/bash

set -e

export CG_DASHBOARD_DIR=$(pwd)
export CG_STYLE_DIR='../cg-style'

if [ ! -d "$CG_STYLE_DIR" ]
then
  echo "ERROR"
  echo
  echo "Please ensure that $CG_STYLE_DIR exists relative to this "
  echo "directory and has a git checkout of "
  echo "https://github.com/18F/cg-style in it."
  exit 1
fi

cd $CG_STYLE_DIR
npm install
npm link

cd $CG_DASHBOARD_DIR
npm link cloudgov-style
npm install --no-shrinkwrap
