const express = require('express');
const helmet = require('helmet');

const knex = require('knex');
const knexConfig = require('./knexfile.js');

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
  db('zoos')
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

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
