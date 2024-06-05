const Photo = require("../models/Photo");
const fs = require("fs");

exports.getAllPhotos = async (req, res) => {
  //res.sendFile(path.resolve(__dirname, "views", "index.html"));

  const page = req.query.page || 1;

  const photosPerPage = 2;

  const totalPhotos = await Photo.find({}).countDocuments();
  console.log(totalPhotos);

  console.log(req.query);
  const photos = await Photo.find({})
    .sort({ dateCreated: -1 })
    .skip((page - 1) * photosPerPage)
    .limit(photosPerPage);

  res.render("index", {
    photos,
    current: page,
    pages: Math.ceil(totalPhotos / photosPerPage),
  });
};

exports.getPhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render("photo", {
    photo,
  });
};

exports.addPhoto = async (req, res) => {
  const uploadsDir = path.join(__dirname, "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, (err) => {
      if (err) {
        console.error("Error creating uploads directory:", err);
      } else {
        console.log("Uploads directory created successfully");
      }
    });
  }

  const uploadedImage = req.files.image;
  const uploadPath = __dirname + "/../public/uploads/" + uploadedImage.name;

  uploadedImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: "/uploads/" + uploadedImage.name,
    });
    res.redirect("/");
  });
};

exports.updatePhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  photo.title = req.body.title;
  photo.description = req.body.description;
  await photo.save();
  res.redirect(`/photos/${req.params.id}`);
};

exports.deletePhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  const imagePath = __dirname + "/../public" + photo.image;
  await fs.unlinkSync(imagePath);
  await Photo.findByIdAndDelete(req.params.id);
  res.redirect("/");
};

exports.editPhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render("edit", {
    photo,
  });
};
