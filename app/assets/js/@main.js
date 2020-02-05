const { shell, remote } = require('electron');
const { updateCommands } = require('./../../libs/commands');
const fs = require('fs');
const transitionLoadTime = 200;
let localRequire = null;

let inputCache = '';
let outputCache = '';

const prefix = createPrefix();

// File

function createPrefix() {
    let string = remote.app.getAppPath().replace(/\\/g, '/');
    if (string.charAt(string.length - 1) !== '/') {
        string += '/';
    }
    return string;
}

function fileExists(path) {
    const address = prefix + path;
    console.log('fileExists: ' + address);
    return fs.existsSync(address);
}

function loadFile(path) {
    const address = prefix + path;
    console.log('loadFile: ' + address);
    return fs.readFileSync(address, 'utf8');
}

function loadJSON(path) {
    return JSON.parse(loadFile(path));
}

function saveJSON(path, data) {
    saveFile(path, JSON.stringify(data));
}

function deleteFile(path) {
    const address = prefix + path;
    console.log('deleteFile: ' + address);
    fs.unlinkSync(address);
}

function saveFile(path, string) {
    const address = prefix + path;
    console.log('saveFile: ' + address);
    fs.writeFileSync(address, string);
}

function loadDir(path, isUnpacked = false) {
    const address = isUnpacked ? unpackedPrefix + path : prefix + path;
    console.log('loadDir: ' + address);
    return fs.readdirSync(address);
}

// External calls

function openLink(url) {
    shell.openExternal(url).catch(console.log);
}

// Tabs calls

function local(fn, args = undefined) {
    if (!localRequire && !localRequire[fn]) {
        console.error('Local JS is not defined');
        return;
    }
    if (typeof localRequire[fn] !== 'function') {
        console.error('Local JS Call is not a function');
        return;
    }
    localRequire[fn](args);
}

function loadTransitions(...transitions) {
    setTimeout(() => {
        for (const transition of transitions) {
            [...document.querySelectorAll(transition.selector)].forEach(element => {
                element.style.transition = transition.value;
            });
        }
    }, transitionLoadTime);
}

function showMsgBox(message) {
    console.log(message);
    remote.dialog.showMessageBoxSync({
        type: 'info',
        title: 'Message Video Generator',
        buttons: ['Ok'],
        message: message
    });
}

// API Calls


// Main page

function loadCSSFiles() {
    const path = 'app/assets/css';
    loadDir(path).forEach(css => {
        if (!css.includes('@')) document.head.insertAdjacentHTML('beforeend', `<link rel="stylesheet" href="../assets/css/${css}"/>`);
    });
}

function addClass(element, className) {
    if (!element.classList.contains(className)) {
        element.className += ` ${className}`;
    }
}

function removeClass(element, className) {
    if (element.classList.contains(className)) {
        element.className = element.className.replace(className, '');
    }
}

function loadTab(target, element) {
    if(localRequire && localRequire.unload) {
        localRequire.unload();
    }
    const toolbarItems = document.getElementsByClassName('toolbar-item');
    for (const toolbarItem of toolbarItems) {
        const classes = toolbarItem.classList;
        if (classes.contains('toolbar-item-selected') && toolbarItem !== element) {
            classes.remove('toolbar-item-selected');
        }
    }
    if (element) {
        element.classList.add('toolbar-item-selected');
    }

    const content = document.getElementById('content');

    content.innerHTML = loadFile(`app/tabs/${target}.html`);

    if (fileExists(`app/assets/js/${target}.js`)) {
        localRequire = require(`./../assets/js/${target}`);
        localRequire.load();
    }
}

async function init() {
    const toolbar = document.getElementById('toolbar');
    const initialTab = toolbar.getAttribute('data-initial-tab');
    loadCSSFiles();
    if (initialTab) {
        loadTab(initialTab, document.querySelector(`[alt="${initialTab}"]`));
    }
    await updateCommands();
    document.getElementById('loading').style.opacity = '0';
}

document.addEventListener('DOMContentLoaded', init);
