const express = require("express");
const multer = require("multer");
const fs = require("fs");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Create uploads folder if not exists
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

// Multer storage config
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload route
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const hash = crypto.createHash("sha256").update(fileBuffer).digest("hex");

    const ext = req.file.originalname.split(".").pop();
    const fileName = `${hash}.${ext}`;
    const filePath = `./uploads/${fileName}`;

    fs.writeFileSync(filePath, fileBuffer);
    return res.json({ hash, fileName, message: "File uploaded and hashed." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Upload failed." });
  }
});

// Download route
app.get("/download/:hash", (req, res) => {
  const hash = req.params.hash;
  const files = fs.readdirSync("./uploads");
  const file = files.find((f) => f.startsWith(hash));

  if (file) {
    res.download(`./uploads/${file}`);
  } else {
    res.status(404).json({ error: "File not found for this hash." });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
