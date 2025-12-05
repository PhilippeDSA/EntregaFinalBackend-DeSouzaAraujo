import express from "express";
import handlebars from "express-handlebars";
import Handlebars from "handlebars";
import productsRouter from "./src/routes/products.router.js";
import cartRouter from "./src/routes/cart.router.js";
import { Server } from "socket.io";
import viewsRouter from "./src/routes/views.router.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import methodOverride from "method-override";
import path from "path"; // 👈 Añadir path para ruta absoluta si es necesario
import { fileURLToPath } from 'url'; // Necesario para ES Modules

dotenv.config();

// Configuración para rutas absolutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.log("Error al conectar a MongoDb:", err));

const app = express();
const PORT = 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'src/public')));

app.use(methodOverride("_method"));

// Registrar helpers y configurar el motor de plantillas
Handlebars.registerHelper("inc", value => value + 1);
Handlebars.registerHelper("dec", value => Math.max(1, value - 1));

const hbs = handlebars.create({
  handlebars: Handlebars,
  helpers: {
    inc: value => value + 1,
    dec: value => value - 1,
    multiply: (a, b) => a * b,
    add: (a, b) => a + b,
  }
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");


// Servidor HTTP
const httpServer = app.listen(PORT, () =>
  console.log(`Servidor Corriendo en puerto ${PORT}`)
);

// Websocket server
const io = new Server(httpServer);

// Middleware para socket.io
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Rutas (Al final)
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);