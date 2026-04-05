function incarcaPersoane() {

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            var xmlDoc = this.responseXML;

            var pers = xmlDoc.getElementsByTagName("persoana");

            var tabel = "<section> <table border='1'><tr><th>Nume</th><th>Prenume</th><th>Varsta</th></tr>";

            for (var i = 0; i < pers.length; i++) {
                tabel += "<tr>";
                tabel += "<td>" + pers[i].getElementsByTagName("nume")[0].textContent + "</td>";
                tabel += "<td>" + pers[i].getElementsByTagName("prenume")[0].textContent + "</td>";
                tabel += "<td>" + pers[i].getElementsByTagName("varsta")[0].textContent + "</td>";
                tabel += "</tr>";
            }

            tabel += "</table></section>";

            document.getElementById("continut").innerHTML = tabel;
        }
    };

    xhttp.open("GET", "resurse/persoane.xml", true);
    xhttp.send();
}