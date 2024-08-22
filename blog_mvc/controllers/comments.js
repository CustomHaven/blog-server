const Comment = require("../models/Comment");

async function index(req, res) {
    try {
        const comments = await Comment.getAll();
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

async function show(req, res) {
    try {
        const id = req.params.id;
        const comment = await Comment.show(id);
        res.status(200).json(comment);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}


async function create(req, res) {
  try {
      const data = req.body;
      const newComment = await Comment.create(data);
      res.status(201).send(newComment);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
}

async function update(req, res) {
  try {
      const id = req.params.id;
      const data = req.body;
      const comment = await Comment.show(parseInt(id));
      const result = await comment.update(data);
      res.status(200).json(result);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
}

async function destroy(req, res) {
  try {
      const id = req.params.id;
      const comment = await Comment.show(parseInt(id));
      await comment.destroy();
      res.sendStatus(204);
  } catch (error) {
      res.status(404).json({ error: error.message });
  }
}

async function showAssociation(req, res) {
    try {
        const id = req.params.id;
        const comment = await Comment.showCommentAssociateReplies(id);
        res.status(200).json(comment);
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