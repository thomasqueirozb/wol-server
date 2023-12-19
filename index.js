require("dotenv").config();

const fs = require("fs");

const crypto = require("crypto");

const http = require("http");
const https = require("https");

const shell = require("shelljs");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

function toBool(v) {
    if (!v) return null;
    let vLower = v.toLowerCase();

    if (vLower === "true") return true;
    if (vLower === "false") return false;
    return null;
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let wol_command = process.env.WOL_COMMAND || "wol";

let password_hashed = toBool(process.env.PASSWORD_HASHED_SHA265);
let password;

if (process.env.PASSWORD) {
    password = process.env.password;
} else {
    try {
        password = fs.readFileSync("password_sha256.txt").toString().trim();
    } catch (e) {
        if (e.code == "ENOENT") {
            console.error("File password_sha256.txt missing");
            console.error(
                "Run the following command to create a hashed password file"
            );
            console.error("\nnode scripts/create_hash.js");
            process.exit(3);
        }
        console.error(e);
        process.exit(1);
    }
}

let use_https = toBool(process.env.USE_HTTPS);

let options = {};
if (use_https) {
    try {
        options = {
            key: fs.readFileSync("ssl/localhost.key").toString(),
            cert: fs.readFileSync("ssl/localhost.crt").toString(),
            ciphers:
                "ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA:ECDHE-RSA-AES256-SHA384",
            honorCipherOrder: true,
            secureProtocol: "TLSv1_2_method",
        };
    } catch (e) {
        if (e.code == "ENOENT") {
            console.error("SSL certificates not found");
            console.error("https won't be used");
            console.error("Run the following command to create the certificates");
            console.error("\nsh scripts/keygen.sh");
            use_https = false;
        } else {
            console.error(e);
            process.exit(1);
        }
    }
}
app.post("/wake", (request, response) => {
    let req_password = request.body.password;

    if (password_hashed) {
        const sha256sum = crypto.createHash("sha256");
        sha256sum.update(req_password);
        req_password = sha256sum.digest("hex");
    }

    if (req_password === password) {
        let ret = shell.exec(wol_command + process.env.MAC_ADDR);
        response.send({ success: ret.code });
    } else {
        response.send({ success: -1 });
    }
});

app.get("/check", (request, response) => {
    let ret = shell.exec("ping -c 1 -W 1 -q " + process.env.IP_CHECK);
    response.send({ success: ret.code });
});

app.get("/", (request, response) => {
    response.sendFile("/public/index.html", { root: __dirname });
});

app.get("/robots.txt", (request, response) => {
    response.sendFile("/public/robots.txt", { root: __dirname });
});

app.get("/handler.js", (request, response) => {
    response.sendFile("/public/handler.js", { root: __dirname });
});

function init_port(port, err) {
    if (err) return console.error(err);

    if (!shell.which(wol_command)) {
        shell.echo("Sorry, this script requires the Wake On Lan command: " + wol_command);
        shell.exit(1);
    }

    console.log("Server is listening on", port);
}

for (let portStr of process.env.HTTP_PORTS.split(",")) {
    let port = parseInt(portStr)
    const httpServer = http.createServer(app);
    httpServer.listen(port, (err) => {
        init_port(port, err);
    });
}

if (use_https) {
    for (let portStr of process.env.HTTP_PORTS.split(",")) {
        let port = parseInt(portStr)
        const httpServer = http.createServer(app);
        httpServer.listen(port, (err) => {
            init_port(port, err);
        });
    }
}
