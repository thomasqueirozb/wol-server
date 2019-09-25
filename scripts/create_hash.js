const crypto = require('crypto');
const sha256sum = crypto.createHash('sha256');
const fs = require('fs');

const standard_input = process.stdin;
standard_input.setEncoding('utf-8');

const stream = fs.createWriteStream("password_sha256.txt");

process.stdout.write("Password: ");

// When user input data and click enter key.
standard_input.on('data', function (data) {
    data = data.trim()
    // console.log("Data:", data);
    if (data == '') {
        console.log('Null password. Exiting...')
        process.exit()
    }
    // console.log('User Input Data : ' + data);
    sha256sum.update(data);
    const hashed = sha256sum.digest('hex');
    console.log('Hash:', hashed);
    stream.write(hashed);
    stream.end()

    console.log("Written file password_sha256.txt")
    console.log("You may need to move this directory to the folder above")
    process.exit()
});
