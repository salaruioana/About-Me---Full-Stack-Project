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