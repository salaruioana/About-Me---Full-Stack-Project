function initCumparaturi() {
    class Produs {
        constructor(id, nume, cantitate) {
            this.id = id;
            this.nume = nume;
            this.cantitate = cantitate;
        }
    }

    const saveProduct = (produs) => {
        let lista = JSON.parse(localStorage.getItem("cumparaturi")) || [];
        lista.push(produs);
        localStorage.setItem("cumparaturi", JSON.stringify(lista));
    };

    const afiseazaProduse = () => {
        const lista = JSON.parse(localStorage.getItem("cumparaturi")) || [];
        const ul = document.getElementById("lista-produse");
        ul.innerHTML = "";
        lista.forEach(item => {
            const li = document.createElement("li");
            li.textContent = `${item.id}. ${item.nume} - ${item.cantitate}`;
            ul.appendChild(li);
        });
    };

    const form = document.getElementById("form-cumparaturi");
    afiseazaProduse();

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const nume = document.getElementById("nume").value;
        const cantitate = document.getElementById("cantitate").value;

        const lista = JSON.parse(localStorage.getItem("cumparaturi")) || [];
        const idNou = lista.length + 1;

        const produs = new Produs(idNou, nume, cantitate);
        saveProduct(produs);
        afiseazaProduse();
        form.reset();
    });
}