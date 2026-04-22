function initInvat() {
    userInfo();
    initCanvas();
}

function userInfo() {
    const dataElem = document.getElementById("data");
    if (!dataElem) return; 

    const updateClock = () => {
        const now = new Date().toLocaleString();
        if (document.getElementById("data")) {
            document.getElementById("data").innerHTML = now;
        } else {
            clearInterval(clockInterval);
        }
    };

    updateClock();
    const clockInterval = setInterval(updateClock, 1000);

    if (document.getElementById("url")) 
        document.getElementById("url").innerHTML = window.location.href;
    
    if (document.getElementById("browser")) 
        document.getElementById("browser").innerHTML = navigator.userAgent;
    
    if (document.getElementById("os")) 
        document.getElementById("os").innerHTML = navigator.platform;

    const locatieElem = document.getElementById("locatie");
    if (locatieElem && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                locatieElem.innerHTML = pos.coords.latitude.toFixed(4) + ", " + pos.coords.longitude.toFixed(4);
            },
            () => {
                locatieElem.innerHTML = "Nu ai permis accesul la locație";
            }
        );
    } else if (locatieElem) {
        locatieElem.innerHTML = "Geolocația nu este suportată";
    }
}


var primuClick = null;
function initCanvas() {
    var canvas = document.getElementById("canvasDesen");
    if (!canvas) return; 

    var ctx = canvas.getContext("2d");

    canvas.addEventListener("click", function(event) {
        var rect = canvas.getBoundingClientRect();
        var x = (event.clientX - rect.left) * (canvas.width / rect.width);
        var y = (event.clientY - rect.top) * (canvas.height / rect.height);

        if (primuClick === null) {
            primuClick = { x: x, y: y };
            document.getElementById("mesajCanvas").textContent = "Click 2: colțul opus";
        } else {
            var latime = x - primuClick.x;
            var inaltime = y - primuClick.y;

            ctx.fillStyle = document.getElementById("culoareUmplere").value;
            ctx.fillRect(primuClick.x, primuClick.y, latime, inaltime);

            ctx.strokeStyle = document.getElementById("culoareContur").value;
            ctx.strokeRect(primuClick.x, primuClick.y, latime, inaltime);

            primuClick = null;
            document.getElementById("mesajCanvas").textContent = "Click 1: primul colț";
        }
    });
}

function reseteazaCanvas() {
    var canvas = document.getElementById("canvasDesen");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    primuClick = null;
    document.getElementById("mesajCanvas").textContent = "Click 1: primul colț";
}



function adaugaLinie() {
    var tabel = document.getElementById("tabelCarti");
    var pozitie = parseInt(document.getElementById("pozitie").value);
    var culoare = document.getElementById("culoareTabel").value;

    var textIntrodus = document.getElementById("textNou").value || "-";
    var pozitieText = parseInt(document.getElementById("pozitieText").value) - 1;

    var nrLinii = tabel.rows.length;
    if (pozitie < 1 || pozitie > nrLinii + 1) {
        document.getElementById("mesajTabel").textContent = "Poziție invalidă! Tabelul are " + nrLinii + " linii.";
        return;
    }

    var linieNoua = tabel.insertRow(pozitie);

    var nrColoane = tabel.rows[0].cells.length;

    for (var i = 0; i < nrColoane; i++) {
        var celula = linieNoua.insertCell(i);
        if (i === pozitieText) {
            celula.textContent = textIntrodus;
        } else {
            celula.textContent = "-"; 
        }
        celula.style.backgroundColor = culoare;
    }

    document.getElementById("mesajTabel").textContent = "Linie adăugată la poziția " + pozitie + ".";
}

function adaugaColoana() {
    var tabel = document.getElementById("tabelCarti");
    var pozitie = parseInt(document.getElementById("pozitie").value);
    var culoare = document.getElementById("culoareTabel").value;

    var textIntrodus = document.getElementById("textNou").value || "-";
    var pozitieText = parseInt(document.getElementById("pozitieText").value) - 1;

    var nrColoane = tabel.rows[0].cells.length;
    if (pozitie < 1 || pozitie > nrColoane + 1) {
        document.getElementById("mesajTabel").textContent = "Poziție invalidă! Tabelul are " + nrColoane + " coloane.";
        return;
    }

    for (var i = 0; i < tabel.rows.length; i++) {
        var celula = tabel.rows[i].insertCell(pozitie);
        if (i === pozitieText) {
            celula.textContent = textIntrodus;
        } else {
            celula.textContent = "-"; 
        }
        celula.style.backgroundColor = culoare;
    }

    document.getElementById("mesajTabel").textContent = "Coloană adăugată la poziția " + pozitie + ".";
}

function trimiteDate() {
    const utilizator = {
        utilizator: document.getElementById("utilizator").value,
        parola: document.getElementById("parola").value,
        nume: document.getElementById("nume").value,
        prenume: document.getElementById("prenume").value,
        email: document.getElementById("email").value,
        telefon: document.getElementById("telefon").value,
        gen: document.getElementById("gen").value,
        mancare: document.getElementById("mancare").value,
        data_nasterii: document.getElementById("data_nasterii").value,
        ora_nasterii: document.getElementById("ora_nasterii").value,
        varsta: document.getElementById("varsta").value,
        adresa_paginii: document.getElementById("adresa_paginii_personale").value,
        motiv: document.getElementById("motiv").value
    };

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/api/utilizatori", true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            alert("Răspuns server: " + this.responseText);
        }
    };

    xhttp.send(JSON.stringify(utilizator));
}

document.addEventListener('input', function(event) {
    if (event.target && event.target.id === 'varsta') {
        const outputVarsta = document.getElementById('valoareVarsta');
        if (outputVarsta) {
            outputVarsta.textContent = event.target.value;
        }
    }
});

function verifica() {
    var x = new XMLHttpRequest();

    x.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var lista = JSON.parse(this.responseText);
            var u = document.getElementById("user").value;
            var p = document.getElementById("pass").value;
            var ok = false;

            lista.forEach(item => {
                if (item.utilizator == u && item.parola == p) ok = true;
            });

            document.getElementById("rezultat").innerHTML =
                ok ? "Autentificare reușită." : "Date greșite.";
        }
    };

    x.open("GET", "resurse/utilizatori.json", true);
    x.send();
}