#!/bin/sh

DIR=$(git rev-parse --show-toplevel | sed -e 's/[&\\/]/\\&/g; s/$/\\/' -e '$s/\\$//')
sed "s/DIR/$DIR/g;s/USER/$USER/g" home-server.service.example > home-server.service

sudo cp home-server.service /usr/lib/systemd/system/home-server.service

sudo systemctl daemon-reload
sudo systemctl enable home-server.service
sudo systemctl start --now home-server.service
