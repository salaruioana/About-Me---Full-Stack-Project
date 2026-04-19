function initCumparaturi() {

    class Produs {
        constructor(id, nume, cantitate) {
            this.id = id;
            this.nume = nume;
            this.cantitate = cantitate;
        }
    }

    class Stocare {
        salveaza(produs) {
            return new Promise((resolve) => resolve(produs));
        }
    }

    class StocareLocalStorage extends Stocare {
        salveaza(produs) {
            return new Promise((resolve) => {
                let lista = JSON.parse(localStorage.getItem("cumparaturi")) || [];
                lista.push(produs);
                localStorage.setItem("cumparaturi", JSON.stringify(lista));
                resolve(produs);
            });
        }
    }

    class StocareIndexedDB extends Stocare {
        salveaza(produs) {
            return new Promise((resolve) => {
                const request = indexedDB.open("MagazinDB", 1);
                request.onupgradeneeded = (e) => {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains("produse")) {
                        db.createObjectStore("produse", { keyPath: "id" });
                    }
                };
                request.onsuccess = (e) => {
                    const db = e.target.result;
                    const tr = db.transaction("produse", "readwrite");
                    tr.objectStore("produse").add(produs);
                    tr.oncomplete = () => resolve(produs);
                };
            });
        }
    }

    if (window.myWorker) window.myWorker.terminate();
    window.myWorker = new Worker('js/worker.js');

    const stocareLS = new StocareLocalStorage();
    const stocareIDB = new StocareIndexedDB();

    const adaugaInTabel = (item) => {
        const tbody = document.querySelector("#tabel-produse tbody");
        const row = tbody.insertRow();
        row.insertCell(0).textContent = item.id; 
        row.insertCell(1).textContent = item.nume;
        row.insertCell(2).textContent = item.cantitate;
    };

    const afiseazaProduseInitiale = () => {
        const tbody = document.querySelector("#tabel-produse tbody");
        tbody.innerHTML = ""; 

        const listaLS = JSON.parse(localStorage.getItem("cumparaturi")) || [];
        listaLS.forEach(item => adaugaInTabel(item));

        const request = indexedDB.open("MagazinDB", 1);
        request.onsuccess = (e) => {
            const db = e.target.result;
            if (db.objectStoreNames.contains("produse")) {
                const tr = db.transaction("produse", "readonly");
                const store = tr.objectStore("produse");
                const getRequest = store.getAll(); 

                getRequest.onsuccess = () => {
                    const listaIDB = getRequest.result;
                    listaIDB.forEach(item => adaugaInTabel(item));
                };
            }
        };
    };

    afiseazaProduseInitiale();

    window.myWorker.onmessage = (e) => {
        adaugaInTabel(e.data);
    };

    const proceseazaAdaugare = (strategieStocare) => {
        const numeStr = document.getElementById("nume").value;
        const cantitateStr = document.getElementById("cantitate").value;
        
        if (!numeStr || !cantitateStr) return;

        const tbody = document.querySelector("#tabel-produse tbody");
        const idSimplu = tbody.rows.length + 1; 
        
        const produs = new Produs(idSimplu, numeStr, cantitateStr);

        strategieStocare.salveaza(produs).then((p) => {
            window.myWorker.postMessage(p);
            document.getElementById("form-cumparaturi").reset();
        });
    };

    document.getElementById("btn-ls").onclick = (e) => {
        e.preventDefault();
        proceseazaAdaugare(stocareLS);
    };

    document.getElementById("btn-idb").onclick = (e) => {
        e.preventDefault();
        proceseazaAdaugare(stocareIDB);
    };
}