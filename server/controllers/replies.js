const Reply = require("../models/Reply");

async function index(req, res) {
    try {
        const comments = await Reply.getAll();
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

async function show(req, res) {
    try {
        const id = req.params.id;
        const comment = await Reply.showReplyAssociateReplies(id);
        res.status(200).json(comment);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

module.exports = {
    index,
    show
}