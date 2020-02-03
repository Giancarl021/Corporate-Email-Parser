const { parseCommands } = require('./../../../libs/commands');

const __keywords = [];

function load() {
    loadTransitions({
        selector: '.split-side-control',
        value: 'background-color .15s'
    });
}

async function run() {
    const input = document.getElementById('input-email');
    const output = document.getElementById('output-email');
    output.innerText = await parseCommands(input.innerText);
}

function highlight() {
    const input = document.getElementById('input-email');
    const text = input.innerText;
    let final = text;
    if(!text) return;
    const regex = /(\${[^}]*?})/gm;
    const highlights = text.match(regex);
    if(!highlights) return;
    for(const highlight of highlights) {
        final = final.replace(highlight, `<span class="highlight">${highlight}</span>`);
    }
    input.innerHTML = final;
    input.setSelectionRange(1,1);
}

module.exports = {
    load,
    run,
    highlight
};