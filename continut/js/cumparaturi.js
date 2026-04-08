function initCumparaturi() {
    class Produs {
        constructor(id, nume, cantitate) {
            this.id = id;
            this.nume = nume;
            this.cantitate = cantitate;
        }
    }

    const worker = new Worker('js/worker.js');

    const saveProduct = (produs) => {
        let lista = JSON.parse(localStorage.getItem("cumparaturi")) || [];
        lista.push(produs);
        localStorage.setItem("cumparaturi", JSON.stringify(lista));
    };

    const adaugaInTabel = (item) => {
        const tbody = document.querySelector("#tabel-produse tbody");
        const row = tbody.insertRow();
        
        row.insertCell(0).textContent = item.id;
        row.insertCell(1).textContent = item.nume;
        row.insertCell(2).textContent = item.cantitate;
    };

    const afiseazaProduseInitiale = () => {
        const lista = JSON.parse(localStorage.getItem("cumparaturi")) || [];
        const tbody = document.querySelector("#tabel-produse tbody");
        tbody.innerHTML = "";
        lista.forEach(item => adaugaInTabel(item));
    };

    worker.onmessage = function(e) {
        const produsNou = e.data;
        adaugaInTabel(produsNou);
    };

    const form = document.getElementById("form-cumparaturi");
    afiseazaProduseInitiale();

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const nume = document.getElementById("nume").value;
        const cantitate = document.getElementById("cantitate").value;

        const lista = JSON.parse(localStorage.getItem("cumparaturi")) || [];
        const idNou = lista.length + 1;

        const produs = new Produs(idNou, nume, cantitate);

        saveProduct(produs);

        worker.postMessage(produs);
        
        form.reset();
    });
}