let form = document.querySelector('form');

form.onsubmit = (ev) => {
    ev.preventDefault();

    const resp = document.getElementById("wol")

    const fd = new FormData(ev.target)
    const password = fd.get("password")

    if (password == "") {
        resp.innerText = "Please insert password"
        return
    }
    resp.innerText = "Requesting..."

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
            resp.innerText = "Invalid password"
        } else if (code == 0) {
            resp.innerText = "Command executed"
        } else {
            resp.innerText = "Error - code: (" + code + ")"
        }
    };

    request.onerror = function() {
        // request failed
    };
    request.send(JSON.stringify(params));
}

let check = document.getElementById("check-btn")
check.onclick = () => {
    document.getElementById("loading").style.display = "inline-block";
    const url = "/check"
    let request = new XMLHttpRequest();
    request.open('GET', url, true);
    const resp = document.getElementById("check");
    resp.innerText = "";

    request.onload = function() { // request successful
        const json = JSON.parse(request.responseText);
        const code = json.success
        if (code == 0) {
            resp.innerText = "Turned on!"
        } else if (code == 1) {
            resp.innerText = "No response"
        } else {
            resp.innerText = "Error - code: (" + code + ")"
        }
        document.getElementById("loading").style.display = "none";
    };
    request.send();
}
