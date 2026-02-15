#!/bin/bash

set -e

if [ -z "$SSH_USERNAME" ] || [ -z "$SSH_PASSWORD" ]; then
    echo "[ERROR] SSH_USERNAME or SSH_PASSWORD not set"
    exit 1
fi

echo "[INFO] Creating SSH user: $SSH_USERNAME"

# Create user if it doesn't exist
if ! id "$SSH_USERNAME" &>/dev/null; then
    useradd -m -s /bin/bash "$SSH_USERNAME"
    echo "$SSH_USERNAME:$SSH_PASSWORD" | chpasswd
    echo "[INFO] User $SSH_USERNAME created."
else
    echo "$SSH_USERNAME:$SSH_PASSWORD" | chpasswd
    echo "[INFO] Password updated for $SSH_USERNAME."
fi

# Ensure sshd directory exists
mkdir -p /var/run/sshd

echo "[INFO] Starting SSH server..."
exec /usr/sbin/sshd -D
