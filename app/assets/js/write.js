const {
    parseCommands
} = require('./../../../libs/commands');

function load() {
    loadTransitions({
        selector: '.split-side-control',
        value: 'background-color .15s'
    });

    document.getElementById('input-email').value = inputCache;
    document.getElementById('output-email').value = outputCache;
}

async function run() {
    const input = document.getElementById('input-email');
    const output = document.getElementById('output-email');
    output.value = await parseCommands(input.value);
}

function copy() {
    const output = document.getElementById('output-email');
    output.select();
    document.execCommand('copy');
}

function unload() {
    inputCache = document.getElementById('input-email').value;
    outputCache = document.getElementById('output-email').value;
}

function parseTab(args) {
    if(!args.element || !args.event) return;
    if(args.event.key === 'Tab') {
        args.event.preventDefault();
        args.element.value += '    ';
    }
}

module.exports = {
    load,
    run,
    copy,
    unload,
    parseTab
};