const beautify = require('js-beautify').js;

function load() {
    const main = loadJSON('commands/main.json');
    const custom = loadJSON('commands/custom.json');

    const mainList = document.getElementById('command-main-list');
    const customList = document.getElementById('command-custom-list');
    for (const key in main) {
        if (main.hasOwnProperty(key) && key.charAt(0) !== '_') {
            createListItem(mainList, { key: key, content: main[key] });
        }
    }
    for (const key in custom) {
        if (custom.hasOwnProperty(key)) {
            createListItem(customList, { key: key, content: custom[key] });
        }
    }
}

function createListItem(dest, data) {
    const item = document.createElement('div');
    item.className = 'command-list-item';
    item.innerHTML = `<h1 class="command-list-item-title">${data.key}</h1><ul class="command-list-item-data"><li>Mensagem<span>${data.content.message}</span></li>${data.content.subcommand ? `<li>Sub-comando<span>function (${typeof data.content.subcommand.args === 'object' ? data.content.subcommand.args.join(', ') : ''}) {<br/>&nbsp&nbsp&nbsp&nbsp${beautify(data.content.subcommand.function, { indent_size: 4, space_in_empty_paren: true }).replace(/\n/gm, '<br/>&nbsp&nbsp&nbsp&nbsp').replace(/\s/gm, '&nbsp')}<br/>}</span></li>` : ''}</ul>`;
    dest.appendChild(item);
}

module.exports = {
    load
};
