function incarcaPersoane() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var xmlDoc = this.responseXML;
            var pers = xmlDoc.getElementsByTagName("persoana");

            var tabel = "<section><table border='1' style='width:100%; border-collapse: collapse;'>";
            tabel += "<tr><th>Nume</th><th>Prenume</th><th>Vârstă</th><th>Adresă</th><th>Job (Companie/Rol)</th></tr>";

            for (var i = 0; i < pers.length; i++) {
                var nume = pers[i].getElementsByTagName("nume")[0].textContent;
                var prenume = pers[i].getElementsByTagName("prenume")[0].textContent;
                var varsta = pers[i].getElementsByTagName("varsta")[0].textContent;

                var adresaNode = pers[i].getElementsByTagName("adresa")[0];
                var strada = adresaNode.getElementsByTagName("strada")[0].textContent;
                var localitate = adresaNode.getElementsByTagName("localitate")[0].textContent;
                var tara = adresaNode.getElementsByTagName("tara")[0].textContent;

                var jobNode = pers[i].getElementsByTagName("job")[0];
                var companie = jobNode.getElementsByTagName("companie")[0].textContent;
                var rol = jobNode.getElementsByTagName("rol")[0].textContent;

                tabel += "<tr>";
                tabel += "<td>" + nume + "</td>";
                tabel += "<td>" + prenume + "</td>";
                tabel += "<td>" + varsta + "</td>";
                tabel += "<td>" + strada + ", " + localitate + " (" + tara + ")</td>";
                tabel += "<td>" + companie + " - <i>" + rol + "</i></td>";
                tabel += "</tr>";
            }

            tabel += "</table></section>";
            document.getElementById("continut").innerHTML = tabel;
        }
    };
    xhttp.open("GET", "resurse/persoane.xml", true);
    xhttp.send();
}