const fileUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const fileName = req.file.filename;
  return res.status(201).send({ fileName });
};

module.exports = { fileUpload };
