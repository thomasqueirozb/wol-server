const fs = require('fs');

try {
    const password_hash = fs.readFileSync('password').toString().trim()
} catch (e) {
    console.log(e.code)
    if (e.code == "ENOENT") {
        console.log(1)
    }
}

