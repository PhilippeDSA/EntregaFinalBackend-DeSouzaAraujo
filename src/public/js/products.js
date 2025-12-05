// /src/public/js/products.js
// Flujo de carrito: crear si no existe en backend -> guardar _id en cookie -> usar siempre

// Helpers para cookies
function readCookie(name) {
    const match = document.cookie.split("; ").find(row => row.startsWith(name + "="));
    if (!match) return null;
    return decodeURIComponent(match.split("=")[1]);
}
function writeCookie(name, value, days = 7) {
    const maxAge = 60 * 60 * 24 * days;
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

// Devuelve el objeto carrito almacenado en cookie (si existe) o null
function getLocalCart() {
    const raw = readCookie("cart");
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch (e) {
        console.error("Error parseando cookie cart:", e);
        return null;
    }
}

// Guarda objeto carrito en cookie
function saveLocalCart(cart) {
    writeCookie("cart", JSON.stringify(cart));
}

// Crea carrito en backend y devuelve el objeto creado
async function createRemoteCart() {
    const res = await fetch("/api/carts", { method: "POST" });
    if (!res.ok) throw new Error("No se pudo crear carrito en backend");
    return await res.json();
}

// Llama al endpoint que agrega producto al carrito remoto
async function addProductRemote(cartId, productId) {
    const res = await fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    });
    if (!res.ok) throw new Error("Error al agregar producto en backend");
    return await res.json(); // devuelve carrito actualizado (con populate si el dao lo hace)
}

// Flujo principal para agregar producto (coordinado cookie + backend)
async function addToCart(productId) {
    try {
        let localCart = getLocalCart();

        // Si no hay carrito local, crear uno remoto y guardarlo localmente
        if (!localCart || !localCart._id) {
            const created = await createRemoteCart();
            // backend devuelve _id y products (vacío)
            localCart = {
                _id: created._id,
                products: created.products || []
            };
            saveLocalCart(localCart);
        }

        // Llamar al backend para agregar (este método incrementa quantity cuando corresponde)
        const updatedCart = await addProductRemote(localCart._id, productId);

        // Normalizamos y guardamos lo que venga del backend en la cookie
        // Si backend devuelve productos con populate -> ok, si devuelve ids -> también ok
        localCart.products = updatedCart.products || [];
        saveLocalCart(localCart);

        // Feedback simple
        alert("Producto agregado al carrito");
    } catch (err) {
        console.error(err);
        alert("Error al agregar al carrito");
    }
}

// Listener para botones
document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".add-to-cart");
    buttons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const pid = btn.dataset.id;
            if (!pid) return alert("Producto sin ID");
            addToCart(pid);
        });
    });
});
