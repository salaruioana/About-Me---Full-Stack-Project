self.addEventListener("message", (e) => {
    const produs = e.data;
    console.log("Worker: Am primit produsul pentru procesare:", produs);
    self.postMessage(produs);
});