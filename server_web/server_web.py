import socket
import os
import gzip
import threading

def proceseaza_client(clientsocket, address):
    print(f"Client conectat: {address}")

    cerere = "" 
    linieDeStart = ""
    while True:
        data = clientsocket.recv(1024)
        cerere = cerere + data.decode()
        print('S-a citit mesajul: \n---------------------------\n' + cerere + '\n---------------------------')
        pozitie = cerere.find('\r\n')
        if (pozitie > -1):
            linieDeStart = cerere[0:pozitie]
            break

    print('S-a primit linia de start '+linieDeStart)
    
    parti = linieDeStart.split()
    if len(parti) < 2:
        clientsocket.close()
        print("Cerere invalidă-conexiune inchisă.")
        return 
    
    resursa = parti[1]
    # Construim calea corectă către folderul 'continut'
    if resursa == '/':
        resursa = '/index.html'
    cale_fisier = os.path.join('..', 'continut', resursa.strip('/'))

    try:
        with open(cale_fisier, 'rb') as f:
            continut_fisier = f.read()
            
        # determinam tipul (extensia)
        extensie = resursa.split(".")[-1] if "." in resursa else ""
        mime_type = "text/plain" 
    
        match extensie:
            case "html": mime_type = "text/html"
            case "css":  mime_type = "text/css"
            case "js":   mime_type = "application/javascript"
            case "png":  mime_type = "image/png"
            case "jpg":  mime_type = "image/jpeg"
            case "ico":  mime_type = "image/x-icon"
        
        continut_comprimat = gzip.compress(continut_fisier)
            
        raspuns = "HTTP/1.1 200 OK\r\n"
        raspuns += "Content-Type: " + mime_type + "\r\n"
        raspuns += "Content-Encoding: gzip\r\n"
        raspuns += "Content-Length: " + str(len(continut_comprimat)) + "\r\n"
        raspuns += "Connection: close\r\n\r\n"

        clientsocket.sendall(raspuns.encode())
        clientsocket.sendall(continut_comprimat) # continut_fisier e deja bytes, nu mai dam .encode()

    except FileNotFoundError:
        raspuns_404 = "HTTP/1.1 404 Not Found\r\nContent-Type: text/html\r\n\r\n"
        err_msg = "<h1>404 - Fisierul nu a fost gasit!</h1>"
        clientsocket.sendall(raspuns_404.encode() + err_msg.encode())

    clientsocket.close()
    print('S-a terminat comunicarea.')

serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
serversocket.bind(('', 5678))
serversocket.listen(5)

while True:
    print('#########################################################################')
    (clientsocket, address) = serversocket.accept()

    #thread pentru fiecare client
    t = threading.Thread(target=proceseaza_client,args = (clientsocket,address))
    t.start()