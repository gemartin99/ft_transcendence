#!/bin/bash

cd /app/crazy_pong

daphne -e ssl:8000:privateKey=/etc/ssl/private/cert.key:certKey=/etc/ssl/certs/cert.crt crazy_pong.asgi:application
