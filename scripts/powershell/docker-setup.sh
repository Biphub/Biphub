#!/bin/bash

docker-machine start
$env:COMPOSE_CONVERT_WINDOWS_PATHS=1
docker-machine env --shell powershell default | Invoke-Expression
