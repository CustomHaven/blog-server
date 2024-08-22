const Reply = require("../models/Reply");

async function index(req, res) {
    try {
        const replies = await Reply.getAll();
        res.status(200).json(replies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

async function show(req, res) {
    try {
        const id = req.params.id;
        const reply = await Reply.show(id);
        res.status(200).json(reply);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}


async function create(req, res) {
  try {
      const data = req.body;
      const newReply = await Reply.create(data);
      res.status(201).send(newReply);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
}

async function update(req, res) {
  try {
      const id = req.params.id;
      const data = req.body;
      const reply = await Reply.show(parseInt(id));
      const result = await reply.update(data);
      res.status(200).json(result);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
}

async function destroy(req, res) {
  try {
      const id = req.params.id;
      const reply = await Reply.show(parseInt(id));
      await reply.destroy();
      res.sendStatus(204);
  } catch (error) {
      res.status(404).json({ error: error.message });
  }
}

async function showAssociation(req, res) {
    try {
        const id = parseInt(req.params.id);
        const reply = await Reply.showReplyAssociateReplies(id);
        res.status(200).json(reply);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}


async function createAssociation(req, res) {
    try {
        const id = parseInt(req.params.id)
        const data = req.body;
        const anotherReply = await Reply.createReplyToAReply(data, id);
        res.status(201).send(anotherReply);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    index,
    show,
    create,
    update,
    destroy,
    showAssociation,
    createAssociation
}