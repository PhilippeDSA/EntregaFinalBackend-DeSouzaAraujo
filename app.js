import express from "express";
import handlebars from "express-handlebars"
import productsRouter from "./src/routes/products.router.js";
import cartRouter from "./src/routes/cart.router.js";
import { Server } from "socket.io";
import viewsRouter from "./src/routes/views.router.js"
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.log("Error al conectar a MongoDb"));


const app = express();
const PORT = 8080;

//Handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servidor HTTP
const httpServer = app.listen(PORT, () =>
  console.log(`Servidor Corriendo en puerto ${PORT}`)
);

// Websocket server
const io = new Server(httpServer);

//Inject IO
app.use((req, rex, next) => {
  req.io = io;
  next();
});



//Rutas Api
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/", viewsRouter);
