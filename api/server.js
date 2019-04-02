const express = require("express");
const helmet = require("helmet");

const zooRouter = require("../router/zooRouter.js");
const bearRouter = require("../router/bearRouter.js");

const server = express();

server.use(helmet());
server.use(express.json());

server.use("/api/zoos", zooRouter);
server.use("/api/bears", bearRouter);

module.exports = server;
