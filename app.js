const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const pageController = require("./controllers/pageController");

const methodOverride = require("method-override");
const fileUpload = require("express-fileupload");

const photoController = require("./controllers/photoControlles");

//connect to the database

mongoose.connect("mongodb://localhost:27017/photoGallery", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
const port = 3000;

//tepmlate engine
app.set("view engine", "ejs");

//middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(methodOverride("_method", { methods: ["POST", "GET"] }));

//routes
app.get("/about", pageController.getAboutpage);
app.get("/add", pageController.getAddpage);

app.get("/", photoController.getAllPhotos);
app.get("/photos/:id", photoController.getPhoto);
app.get("/photos/edit/:id", photoController.editPhoto);
app.post("/photos", photoController.addPhoto);
app.put("/photos/:id", photoController.updatePhoto);
app.delete("/photos/:id", photoController.deletePhoto);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
