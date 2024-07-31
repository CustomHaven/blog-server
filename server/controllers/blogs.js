const Blog = require("../models/Blog");

async function show(req, res) {
  try {
      const id = req.params.id;
      const country = await Blog.show(id);
      res.status(200).json(country);
  } catch (error) {
      res.status(404).json({ error: error.message });
  }
}

module.exports = {
  show,
}