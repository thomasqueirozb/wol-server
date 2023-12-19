# Wake-On-Lan Server

![Image of the running server](/page.png)

## How to run:

1. Copy .env.example to .env
1. **Read and change the file accordingly**
1. npm install && npm start
1. Insert your password correctly and ping the machine using the check button!

## Functionalities

1. Ping the machine via IP
1. HTTPs (run [scripts/keygen.sh](/scripts/keygen.sh) and place `localhost.key` and `localhost.crt` into the ssl folder)
1. Run on multiple ports (edit the `HTTP_PORTS` and/or `HTTPS_PORTS`)
1. Systemd service (see [scripts/make_service.sh](/scripts/make_service.sh))


### Notes

You can also store a hashed pasword (in sha256) in the .env file if you set `PASSWORD_HASHED_SHA265` to `true`.
