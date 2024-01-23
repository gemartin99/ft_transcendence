#!/bin/bash

cd /app/crazy_pong

daphne -e ssl:443:privateKey=crazy-pong.com_private_key.key:certKey=crazy-pong.com_ssl_certificate.cer crazy_pong.crazy_pong.asgi:application
