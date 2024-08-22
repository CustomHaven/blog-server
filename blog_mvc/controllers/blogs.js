const Blog = require("../models/Blog");


async function index(req, res) {
  try {
      const blogs = await Blog.getAll();
      res.status(200).json(blogs);
  } catch (error) {
      res.status(404).json({ error: error.message });
  }
};

async function show(req, res) {
  try {
      const id = req.params.id;
      const country = await Blog.show(id);
      res.status(200).json(country);
  } catch (error) {
      res.status(404).json({ error: error.message });
  }
}


async function create(req, res) {
  try {
      const data = req.body;
      const newBlog = await Blog.create(data);
      res.status(201).send(newBlog);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
}

async function update(req, res) {
  try {
      const id = req.params.id;
      const data = req.body;
      const blog = await Blog.show(parseInt(id));
      const result = await blog.update(data);
      res.status(200).json(result);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
}

async function destroy(req, res) {
  try {
      const id = req.params.id;
      const blog = await Blog.show(parseInt(id));
      await blog.destroy();
      res.sendStatus(204);
  } catch (error) {
      res.status(404).json({ error: error.message });
  }
}

async function showAssociation(req, res) {
    try {
        const id = req.params.id;
        const blog = await Blog.showBlogAssociateComments(id);
        res.status(200).json(blog);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

module.exports = {
    index,
    show,
    create,
    update,
    destroy,
    showAssociation
}