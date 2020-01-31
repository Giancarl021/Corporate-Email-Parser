const fs = require('fs');
const { getCommands, parseCommands } = require('./libs/commands');

const commands = getCommands();

const email = fs.readFileSync('email.txt', 'utf8');

console.log(getDayTime());

let final;

function getDayTime() {
    const now = new Date().getUTCHours() - 3;
    let dayTime;
    if(now >= 20 || now <= 4) {
        dayTime = 'Boa noite';
    } else if(now >= 13 && now <= 19) {
        dayTime = 'Boa tarde';
    } else {
       dayTime = 'Bom dia'
    }
    return dayTime;
}