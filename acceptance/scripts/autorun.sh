#!/bin/bash

(sudo Xvfb :10 &) && export DISPLAY=:10 && go get -tags acceptance ./... && cd acceptance && go test -tags acceptance && cd ..
