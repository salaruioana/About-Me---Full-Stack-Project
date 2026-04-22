import socket
import os
import gzip
import threading
import json

serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
serversocket.bind(('', 5678))
serversocket.listen(5)
print("Server pornit pe portul 5678")


def proceseaza_client(clientsocket, address):
    print(f"Client conectat: {address}")

    try:
        cerere = ""
        linieDeStart = ""

        while True:
            data = clientsocket.recv(1024)
            if not data:
                break

            cerere += data.decode()

            poz = cerere.find("\r\n")
            if poz > -1:
                linieDeStart = cerere[:poz]
                break

        print(f"Linia de start: {linieDeStart}")

        parti = linieDeStart.split()
        if len(parti) < 2:
            print("Cerere invalidă")
            clientsocket.close()
            return

        resursa = parti[1]
        metoda = parti[0]


        if metoda == "POST" and resursa == "/api/utilizatori":
            while "\r\n\r\n" not in cerere:
                cerere += clientsocket.recv(1024).decode()

            headers, body = cerere.split("\r\n\r\n", 1)

            lungime = 0
            for linie in headers.split("\r\n"):
                if linie.lower().startswith("content-length:"):
                    lungime = int(linie.split(":")[1].strip())

            body_bytes = body.encode()
            while len(body_bytes) < lungime:
                chunk = clientsocket.recv(1024)
                if not chunk: break
                body_bytes+= chunk
            body_final = body_bytes.decode('utf-8')

            try:
                nou_utilizator = json.loads(body_final)

                with open("../continut/resurse/utilizatori.json", "r", encoding="utf-8") as f:
                    lista = json.load(f)

                lista.append(nou_utilizator)

                with open("../continut/resurse/utilizatori.json", "w", encoding="utf-8") as f:
                    json.dump(lista, f, indent=4, ensure_ascii=False)

                raspuns = (
                    "HTTP/1.1 200 OK\r\n"
                    "Content-Type: text/plain\r\n"
                    "Content-Length: 17\r\n"
                    "Connection: close\r\n\r\n"
                    "Utilizator salvat"
                )

                clientsocket.sendall(raspuns.encode())
                clientsocket.close()
                return

            except Exception as e:
                print("Eroare la procesare POST:", e)
                raspuns = "HTTP/1.1 500 Internal Server Error\r\n\r\n"
                clientsocket.sendall(raspuns.encode())
                clientsocket.close()
                return
        if metoda == "POST" and resursa == "/api/abonati":
            while "\r\n\r\n" not in cerere:
                cerere += clientsocket.recv(1024).decode()

            headers, body = cerere.split("\r\n\r\n", 1)

            lungime = 0
            for linie in headers.split("\r\n"):
                if linie.lower().startswith("content-length:"):
                    lungime = int(linie.split(":")[1].strip())

            body_bytes = body.encode()
            while len(body_bytes) < lungime:
                chunk = clientsocket.recv(1024)
                if not chunk: break
                body_bytes+= chunk
            body_final = body_bytes.decode('utf-8')

            try:
                nou_utilizator = json.loads(body_final)

                with open("../continut/resurse/abonati.json", "r", encoding="utf-8") as f:
                    lista = json.load(f)

                lista.append(nou_utilizator)

                with open("../continut/resurse/abonati.json", "w", encoding="utf-8") as f:
                    json.dump(lista, f, indent=4, ensure_ascii=False)

                raspuns = (
                    "HTTP/1.1 200 OK\r\n"
                    "Content-Type: text/plain\r\n"
                    "Content-Length: 13\r\n"
                    "Connection: close\r\n\r\n"
                    "Abonat salvat"
                )

                clientsocket.sendall(raspuns.encode())
                clientsocket.close()
                return

            except Exception as e:
                print("Eroare la procesare POST:", e)
                raspuns = "HTTP/1.1 500 Internal Server Error\r\n\r\n"
                clientsocket.sendall(raspuns.encode())
                clientsocket.close()
                return
    
        if resursa == "/":
            resursa = "/index.html"

        cale_fisier = "..\\continut" + resursa

        try:
            with open(cale_fisier, "rb") as f:
                continut_fisier = f.read()
        except:
            raspuns_404 = (
                "HTTP/1.1 404 Not Found\r\n"
                "Content-Type: text/html\r\n"
                "Content-Length: 37\r\n"
                "Connection: close\r\n\r\n"
            )
            clientsocket.sendall(raspuns_404.encode() + b"<h1>404 - Fisier lipsa!</h1>")
            clientsocket.close()
            return

        extensie = resursa.split(".")[-1].lower()

        mime_type = {
            "html": "text/html",
            "css": "text/css",
            "js": "text/javascript",
            "png": "image/png",
            "jpg": "image/jpeg",
            "jpeg": "image/jpeg",
            "gif": "image/gif",
            "ico": "image/x-icon",
            "xml": "application/xml; charset=utf-8",
            "json": "application/json; charset=utf-8"
        }.get(extensie, "application/octet-stream")

        continut_comprimat = gzip.compress(continut_fisier)

        raspuns = (
            "HTTP/1.1 200 OK\r\n"
            f"Content-Type: {mime_type}\r\n"
            "Content-Encoding: gzip\r\n"
            f"Content-Length: {len(continut_comprimat)}\r\n"
            "Connection: close\r\n\r\n"
        )

        clientsocket.sendall(raspuns.encode())
        clientsocket.sendall(continut_comprimat)

    except Exception as e:
        print("Eroare în thread:", e)

    clientsocket.close()
    print("Conexiune închisă.\n")


while True:
    clientsocket, address = serversocket.accept()
    t = threading.Thread(target=proceseaza_client, args=(clientsocket, address))
    t.start()