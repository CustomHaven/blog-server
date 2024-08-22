const User = require("../models/User");


async function index(req, res) {
    try {
        const users = await User.getAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

async function show(req, res) {
  try {
      const id = req.params.id;
      const country = await User.show(parseInt(id));
      res.status(200).json(country);
  } catch (error) {
      res.status(404).json({ error: error.message });
  }
}

async function create(req, res) {
    try {
        const data = req.body;
        const newUser = await User.create(data);
        res.status(201).send(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function update(req, res) {
    try {
        const id = req.params.id;
        const data = req.body;
        const user = await User.show(parseInt(id));
        console.log("first", user)
        const result = await user.update(data);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function destroy(req, res) {
    try {
        const id = req.params.id;
        const user = await User.show(parseInt(id));
        await user.destroy();
        res.sendStatus(204);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}



module.exports = {
    index,
    show,
    create,
    update,
    destroy
}