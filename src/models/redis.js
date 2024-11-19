"use strict";

const { createClient, ClientClosedError } = require('redis');
const client = createClient();

client.connect();

module.exports = client;