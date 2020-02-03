const { parseCommands } = require('./../../../libs/commands');

function load() {
    loadTransitions({
        selector: '.split-side-control',
        value: 'background-color .15s'
    });
}

async function run() {
    const input = document.getElementById('input-email');
    const output = document.getElementById('output-email');
    output.value = await parseCommands(input.value);
}

module.exports = {
    load,
    run
};