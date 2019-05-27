const express = require("express");
const helmet = require("helmet");

const knex = require("knex");
const knexConfig = require("./knexfile.js");

const db = knex(knexConfig.development);

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here

server.get("/", (req, res) => {
  res.send(
    "There are three kinds of people in this world, those who can count and those who can not."
  );
});

server.get("/api/zoos", (req, res) => {
  db("zoos")
    .then(zoos => {
      res.json(zoos);
    })
    .catch(err => {
      res.status(500).json({
        error: err,
        message: "The zoo information could not be retrieved."
      });
    });
});

server.get("/api/zoos/:id", (req, res) => {
  const zooID = req.params.id;
  db("zoos")
    .where({ id: zooID })
    .then(zoo => {
      res.status(200).json(zoo);
    })
    .catch(err => {
      res.status(500).json({
        error: err,
        message: "The zoo information could not be retrieved."
      });
    });
});

server.post("/api/zoos", (req, res) => {
  db("zoos")
    .insert(req.body)
    .then(zoos => {
      res.status(201).json({ message: "Successfully created zoo." });
    })
    .catch(err => {
      res.status(500).json({
        error: err,
        message: "There was an error while saving the zoo to the database."
      });
    });
});

server.delete("/api/zoos/:id", (req, res) => {
  const zooID = req.params.id;

  db("zoos")
    .where({ id: zooID })
    .delete()
    .then(zoo => {
      res.status(201).end();
    })
    .catch(err => {
      res.status(404).json({
        error: err,
        message: "The zoo with the specified ID does not exist."
      });
    });
});

server.put("/api/zoos/:id", (req, res) => {
  db("zoos")
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        db("zoos")
          .where({ id: req.params.id })
          .first()
          .then(zoo => {
            res.status(200).json({ message: "Successfully updated zoo." });
          });
      } else {
        res.status(400).json({
          message: "The zoo with the specified ID does not exist."
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err,
        message: "The zoo information could not be modified."
      });
    });
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
