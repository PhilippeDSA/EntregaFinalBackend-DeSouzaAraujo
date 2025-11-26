const socket = io();

// recibir lista actualizada
socket.on("productsUpdated", (products) => {
    const list = document.getElementById("productList");
    list.innerHTML = "";

    products.forEach(p => {
        const li = document.createElement("li");
        li.textContent = `${p.title} - $${p.price} (ID:${p.id})`;

        const btn = document.createElement("button");
        btn.textContent = "Eliminar";
        btn.onclick = () => socket.emit("deleteProduct", p.id);
        li.appendChild(btn);
        list.appendChild(li);
    });
});

// listener del formulario
document.getElementById("productForm").addEventListener("submit", e => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const price = document.getElementById("price").value;
    socket.emit("addProduct", { title, price });
    e.target.reset();
});

document.getElementById("deleteForm").addEventListener("submit", e => {
    e.preventDefault();
    const id = document.getElementById("deleteId").value;
    socket.emit("deleteProduct", id);
    e.target.reset();
});
