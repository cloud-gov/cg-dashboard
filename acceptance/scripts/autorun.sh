#!/bin/bash

(sudo Xvfb :10 &) && export DISPLAY=:10 && cd acceptance && go test -tags acceptance && cd ..
