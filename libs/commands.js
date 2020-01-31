const fs = require('fs');

function parseCommands(text) {
    const header = text.split('#')[1];
    console.log(header);
}

function getCommands() {
    const path = 'commands';
    const dir = fs.readdirSync(path);
    const commands = [];
    dir.forEach(file => {
        const command = JSON.parse(fs.readFileSync(`${path}/${file}`));
        if(command.subcommand) {
            command.function = command.function = new Function(...command.subcommand.args, command.subcommand.function);
        }
        commands.push(command)
    });

    return commands;
}

module.exports = {
    parseCommands,
    getCommands
};