const fs = require('fs');
const { parseCommands } = require('./libs/commands');

const email = fs.readFileSync('email.txt', 'utf8');

console.log(parseCommands(email));

let final;