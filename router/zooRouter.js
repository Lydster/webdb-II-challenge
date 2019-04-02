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
  db("zoos")
    .insert(req.body)
    .then(ids => {
      const [id] = ids;
      db("zoos")
        .where({ id })
        .first()
        .then(zoo => {
          res.status(200).json(zoo);
        });
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.get("/", (req, res) => {
  db("zoos")
    .then(zoos => {
      res.status(200).json(zoos);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.get("/:id", (req, res) => {
  db("zoos")
    .where({ id: req.params.id })
    .first()
    .then(zoo => {
      if (zoo) {
        res.status(200).json(zoo);
      } else {
        res.status(404).json({
          message: "could not get zoo of index selected. Zoo does not exist"
        });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db("zoos")
    .where({ id })
    .del()
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: "Successfully Deleted" });
      } else {
        res
          .status(404)
          .json({ error: "The zoo you are trying to delete does not exist." });
      }
    })
    .catch(err => {
      res.status(500).json({ err: "Server error" });
    });
});

router.put("/:id", (req, res) => {
  db("zoos")
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        db("zoos")
          .where({ id: req.params.id })
          .first()
          .then(zoo => {
            res.status(200).json(zoo);
          });
      } else {
        res.status(404).json({ error: "Zoo selected does not exist" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

module.exports = router;
