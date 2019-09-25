const fs = require('fs');

const crypto = require('crypto');

const http = require('http');
const https = require('https');

const shell = require('shelljs');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

try {
    const password_hash = fs.readFileSync('password_sha256.txt').toString().trim()
} catch (e) {
    if (e.code == 'ENOENT') {
        console.log('File password_sha256.txt missing');
        console.log('Run the following command to create a hashed password file')
        console.log('\nnode scripts/create_hash.js')
        process.exit(3)
    }
    console.log(e)
    process.exit(1)
}

const options = {
    key: fs.readFileSync('ssl/localhost.key').toString(),
    cert: fs.readFileSync('ssl/localhost.crt').toString(),
    ciphers: 'ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA:ECDHE-RSA-AES256-SHA384',
    honorCipherOrder: true,
    secureProtocol: 'TLSv1_2_method'
};

app.post('/wake', (request, response) => {
    const sha256sum = crypto.createHash('sha256');
    sha256sum.update(request.body.password);
    const hashed = sha256sum.digest('hex');

    if (hashed == password_hash) {
        let ret = shell.exec("wol d4:3d:7e:f1:50:4f");
        response.send({"success": ret.code});
    } else {
        response.send({"success": -1});
    }
})

app.get('/check', (request, response) => {
    let ret = shell.exec("ping -c 1 -W 1 -q 192.168.0.30");
    response.send({"success": ret.code});
})

app.get('/', (request, response) => {
    response.sendFile('/public/index.html', {root: __dirname});
})

app.get('/robots.txt', (request, response) => {
    response.sendFile('/public/robots.txt', {root: __dirname});
})

app.get('/handler.js', (request, response) => {
    response.sendFile('/public/handler.js', {root: __dirname});
})


function init_port(port, err) {
    if (err)
        return console.log('[ERROR]', err);

    if (!shell.which('wol')) {
      shell.echo('Sorry, this script requires wol (Wake On LAN)');
      shell.exit(1);
    }

    console.log('Server is listening on', port);
}

var httpServer = http.createServer(app);
var httpsServer = https.createServer(options, app);
httpServer.listen(8080, (err) => {init_port(8080, err);})
httpsServer.listen(8443, (err) => {init_port(8443, err);})

var httpServer80 = http.createServer(app);
var httpsServer443 = https.createServer(options, app);
httpServer80.listen(80, (err) => {init_port(80, err);})
httpsServer443.listen(443, (err) => {init_port(443, err);})
