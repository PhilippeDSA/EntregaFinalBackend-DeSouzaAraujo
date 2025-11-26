import express from "express";
import handlebars from "express-handlebars"
import productsRouter from "./src/routes/products.router.js";
import cartRouter from "./src/routes/cart.router.js";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import viewsRouter from "./src/routes/views.router.js"
import ProductManager from "./src/manager/productManager.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = 8080;

//Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "handlebars");

//middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servidor HTTP
const httpServer = app.listen(PORT, () =>
  console.log(`Servidor Corriendo en puerto ${PORT}`)
);

// Websocket server
const io = new Server(httpServer);
app.use((req,rex,next)=>{
  req.io=io;
  next();
});


// inyectar io en req
app.use((req, res, next) => {
  req.io = io;
  next();
});

//instanciar product manager unificado
const productManager = new ProductManager(path.join(__dirname, "src", "data", "product.json"));


// SOCKET.IO
io.on("connection", async (socket) => {
  console.log("Cliente conectado via WebSocket♥");

  //Enviar lista inicial:
  socket.emit("productsUpdated", await productManager.getProducts());

  //Agregar producto:
  socket.on("addProduct", async (data) => {
    await productManager.addProduct(data);
    io.emit("productsUpdated", await productManager.getProducts());
  });

  //Eliminar producto:
  socket.on("deleteProduct", async (id) => {
    await productManager.deleteProduct(id);
    io.emit("productsUpdated", await productManager.getProducts());
  });
});

//Rutas
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/", viewsRouter);
