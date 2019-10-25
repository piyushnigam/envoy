#!/bin/sh
python3 /code/service.py ${PORT} &
envoy -c /etc/service${BASE_ID}-envoy.yaml --service-cluster service${SERVICE_NAME} --base-id ${BASE_ID}
