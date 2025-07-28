#!/bin/bash

if [ -n "$MYUSER_PASSWORD" ]; then
    echo "myuser:$MYUSER_PASSWORD" | chpasswd
    echo "[INFO] Set password for myuser."
else
    echo "[WARNING] MYUSER_PASSWORD not set. SSH login may fail."
fi

exec /usr/sbin/sshd -D
