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

module.exports = router;
