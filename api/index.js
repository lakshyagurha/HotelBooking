const cors = require("cors");
const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const place = require("./models/Place");
const Bookings = require("./models/Booking");
const bodyParser = require("body-parser");

app.use(bodyParser.json());

const multer = require("multer");

require("dotenv").config();

const bcryptsalt = bcrypt.genSaltSync(10);
const jwtSecrete = "lakjdfoijvhzhxvnnvoauhvas";

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
let cookie;
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

mongoose.connect(process.env.MONGO_URL);

app.get("/test", (req, res) => {
  res.json("test ok");
});

app.get("/profile", (req, res) => {
  // res.cookie('token', cookie)
});

const middleware = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    console.log(token);
    jwt.verify(token, jwtSecrete, (err, decode) => {
      if (err) {
        console.log(err);
      } else {
        req.body.userid = decode.id;
        next();
      }
    });
  } catch {}
};
app.post("/profile", middleware, async (req, res) => {
  const findid = await User.findOne({ _id: req.body.userid });
  if (findid == 0) {
    console.log("Sorry id dosent exits");
  } else {
    res.status(201).send({
      successMessage: `Welcome ${findid.name}`,
      key: true,
      Name: `${findid.name}`,
    });
  }
});

app.post("/uploadbylink", async (req, res) => {
  const { link } = req.body;
  const newName = "Photo" + Date.now() + ".jpeg";

  // await imagedownload.image({
  //   url: link,
  //   dest: __dirname + "/uploads" + newName ,
  // });
  downloadImage(link, __dirname + "/uploads/" + newName);
  res.json(newName);
});
function downloadImage(url, filepath) {
  client.get(url, (res) => {
    res.pipe(fs.createWriteStream(filepath));
  });
}

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email);

  const userDocument = await User.findOne({ email });

  if (userDocument) {
    const passok = bcrypt.compareSync(password, userDocument.password);
    if (passok) {
      jwt.sign(
        { email: userDocument.email, id: userDocument._id },
        jwtSecrete,
        {},
        (err, token) => {
          if (err) throw err;
          res.status(201).send({
            successMessage: `welcome user ${userDocument.name} `,
            Name: userDocument.name,
            token,
            key: "success",
          });
          // res.cookie('token',token).json(userDocument)
          // cookie = token
        }
      );
    } else {
      res.status(422).json("password is no okay");
    }
  } else {
    res.json("Not found checking the password");
  }
});

const photosMiddleware = multer({ dest: "uploads/" });
app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];

    const newPath = path + "." + ext;

    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads/", ""));
  }
  res.json(uploadedFiles);
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  ``;

  try {
    const userdoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptsalt),
    });
    res.json(userdoc);
  } catch (e) {
    res.status(422).json(e);
  }
});



app.post("/places", (req, res) => {
  const token = req.body.token;
  console.log("this is /places token" + token);
  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuest,
    price,
  } = req.body;
  jwt.verify(token, jwtSecrete, async (err, userData) => {
    if (err) {
      console.log(err);
    } else {
      const placeDoc = await place.create({
        owner: userData.id,
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuest,
        price,
      });
      res.json(placeDoc);
    }
  });
});

app.put("/places", async (req, res) => {
  const token = req.body.token;

  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuest,
    price,
  } = req.body;

  jwt.verify(token, jwtSecrete, {}, async (err, userData) => {
    const placeDoc = await place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuest,
        price,
      });
      await placeDoc.save();
      res.json("ok");
    }
    if (err) throw err;
  });
});

app.get("/allPlaces", async (req, res) => {
  res.json(await place.find());
});
app.get("/places/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await place.findById(id));
});




app.post("/bookingThisPlace", async (req, res) => {
  const token = req.body.token;

  const { place, checkIn, checkOut, numberOfGuests, name, phone, price } =
    req.body;
  jwt.verify(token, jwtSecrete, async (err, userData) => {
    if (err) {
      console.log(err);
    } else {
      await Bookings.create({
        place,
        checkIn,
        checkOut,
        numberOfGuests,
        name,
        phone,
        price,
        user:userData.id
      })
        .then((doc) => {
          res.json(doc);
        })
        .catch((err) => {
          throw err;
        });
    }
  });
});
app.post("/getPlaceData", middleware, async (req, res) => {
  const { id } = req.body.userid;
  res.json(await place.find({ owner: id }));
});
app.post("/bookings", middleware, async (req, res) => {
  const id  = req.body.userid;
  res.json(await Bookings.find({ user: id}).populate('place'));
});


app.listen(4000);
