//script sectiunea 1

window.onload = function () {
    // Data și ora curentă
    document.getElementById("data").innerHTML = new Date().toLocaleString();

    // URL
    document.getElementById("url").innerHTML = window.location.href;

    // Browser + OS
    document.getElementById("browser").innerHTML = navigator.userAgent;
    document.getElementById("os").innerHTML = navigator.platform;

    // Locația curentă
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (pos) {
                document.getElementById("locatie").innerHTML =
                    pos.coords.latitude.toFixed(4) + ", " +
                    pos.coords.longitude.toFixed(4);
            },
            function () {
                document.getElementById("locatie").innerHTML =
                    "Nu ai permis accesul la locație";
            }
        );
    } else {
        document.getElementById("locatie").innerHTML =
            "Geolocația nu este suportată";
    }
};

//script secțiunea 2


// variabila care retine primul punct apasat
var primuClick = null;

var canvas = document.getElementById("canvasDesen");
var ctx = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// la fiecare click pe canvas
canvas.addEventListener("click", function(event) {
    // poziția mouseului relativ la canvas
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    if (primuClick === null) {
        // primul click: memorăm punctul
        primuClick = { x: x, y: y };
        document.getElementById("mesajCanvas").textContent = "Click 2: colțul opus";
    } else {
        // al doilea click: desenăm dreptunghiul
        var latime = x - primuClick.x;
        var inaltime = y - primuClick.y;

        ctx.fillStyle = document.getElementById("culoareUmplere").value;
        ctx.fillRect(primuClick.x, primuClick.y, latime, inaltime);

        ctx.strokeStyle = document.getElementById("culoareContur").value;
        ctx.strokeRect(primuClick.x, primuClick.y, latime, inaltime);

        // resetăm pentru următorul dreptunghi
        primuClick = null;
        document.getElementById("mesajCanvas").textContent = "Click 1: primul colț";
    }
});

// șterge tot de pe canvas
function reseteazaCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    primuClick = null;
    document.getElementById("mesajCanvas").textContent = "Click 1: primul colț";
}