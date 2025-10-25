import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import generateRoute from "./routes/generate.js";

const app = express();
app.use(cors({ origin: "http://localhost:5173" })); // ✅ autorise ton front
app.use(bodyParser.json());

app.use("/api", generateRoute);

app.listen(3000, () => {
    console.log("🚀 Backend démarré sur http://localhost:3000");
});
