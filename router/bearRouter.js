const router = require("express").Router();
const knex = require("knex");

const knexConfig = {
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: "./data/lambda.sqlite3"
  }
};

const db = knex(knexConfig);

router.post("/", (req, res) => {
  db("bears")
    .insert(req.body)
    .then(ids => {
      const [id] = ids;
      db("zoos")
        .where({ id })
        .first()
        .then(bear => {
          res.status(200).json(bear);
        });
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.get("/", (req, res) => {
  db("bears")
    .then(bears => {
      res.status(200).json(bears);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.get("/:id", (req, res) => {
  db("bears")
    .where({ id: req.params.id })
    .first()
    .then(bear => {
      if (bear) {
        res.status(200).json(bear);
      } else {
        res.status(404).json({
          message: "Could not get zoo of index selected. Bear does not exist."
        });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db("bears")
    .where({ id })
    .del()
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: "Successfully deleted!" });
      } else {
        res
          .status(404)
          .json({ error: "The bear you are tring to delete does not exist" });
      }
    })
    .catch(err => {
      res.status(500).json({ err: "Server error" });
    });
});

router.put("/:id", (req, res) => {
  db("bears")
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        db("bears")
          .where({ id: req.params.id })
          .first()
          .then(bear => {
            res.status(200).json(bear);
          });
      } else {
        res
          .status(404)
          .json({ error: "Bear you are trying to update does not exist" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

module.exports = router;
