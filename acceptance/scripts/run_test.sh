#!/bin/bash

set -e
set -o pipefail
set +x

####
# Two opearting modes
# debug: sets up a container where a developer can vnc into and run tests
# auto: automatically runs the tests
####

DEBUG=0
AUTO=0
for i in "$@"
do
case $i in
	-d|--debug)
		DEBUG=1
		;;
	-a|--auto)
		AUTO=1
		;;
	*)
		echo "Unknown flag."
		exit 1
		;;
esac
done

if [[ ($DEBUG -eq 0 && $AUTO -eq 0) ]]; then
	echo "Defaulting to auto mode"
fi


SCRIPTPATH="$(dirname "$0")"
IMAGE_NAME=acceptancetest
ENV_FILE=$SCRIPTPATH/.env_docker
echo "Creating the env vars for the container."
env | grep "CONSOLE_" > $ENV_FILE

docker build -t $IMAGE_NAME -f acceptance/Dockerfile .

IMAGE_PORT=$(( ( $RANDOM % 10000 )  + 10000 ))
if [[ $DEBUG -eq 1 ]]; then
	echo "Running in debug mode"
	docker run -itd -p $IMAGE_PORT:5900 --env-file $ENV_FILE $IMAGE_NAME
	HOST_IP=$(docker-machine ip $DOCKER_MACHINE_NAME)
	#open vnc://$HOST_IP:$IMAGE_PORT
	echo "Open your vnc client to $HOST_IP:$IMAGE_PORT"
fi
if [[ $AUTO -eq 1 ]]; then
	echo "Running in auto mode"
	docker run -it -p $IMAGE_PORT:5900 --env-file $ENV_FILE $IMAGE_NAME acceptance/scripts/autorun.sh
fi
