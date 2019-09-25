let form = document.querySelector('form');

form.onsubmit = (ev) => {
    ev.preventDefault();

    const resp = document.getElementById("wol")

    const fd = new FormData(ev.target)
    const password = fd.get("password")

    if (password == "") {
        resp.innerText = "Bota uma senha animal"
        return
    }
    resp.innerText = "Requestando caraio"

    params = {
        "password": password
    }

    const url = "/wake";
    let request = new XMLHttpRequest();
    request.open('POST', url, true);

    // request.setRequestHeader('Authorization', 'Bearer ' + access_token);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    request.onload = function() { // request successful
        const json = JSON.parse(request.responseText);
        const code = json.success
        if (code == -1) {
            resp.innerText = "Vai tomar no seu cu seu comunista de merda para de tentar advinhar a senha seu corno do caralho"
        } else if (code == 0) {
            resp.innerText = "Ae caraio bora frita a cpu do PC"
        } else {
            resp.innerText = "Deu erro chora mais esquerdinha (" + code + ")"
        }
    };

    request.onerror = function() {
        // request failed
    };
    request.send(JSON.stringify(params));
}

let check = document.getElementById("check-btn")
check.onclick = () => {
    const url = "/check"
    let request = new XMLHttpRequest();
    request.open('GET', url, true);
    const resp = document.getElementById("check")
    resp.innerText = "Checkando poura"

    request.onload = function() { // request successful
        const json = JSON.parse(request.responseText);
        const code = json.success
        if (code == 0) {
            resp.innerText = "Tamo de pé bora fritar"
        } else if (code == 1) {
            resp.innerText = "Acalma o cu que não ligou"
        } else {
            resp.innerText = "Deu erro chora mais esquerdinha (" + code + ")"
        }
    };
    request.send();
}
