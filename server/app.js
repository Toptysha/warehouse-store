require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
// const MAIN_DATA = require("./prod-dev-data");
// const { photosDirectory } = require("./controllers/photos");

const PORT = process.env.PORT || 7000;

const app = express();

// app.use(express.static("../client/build"));

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/", routes);
// app.use("/photos", express.static(photosDirectory()));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
