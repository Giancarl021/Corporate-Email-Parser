const { shell, remote } = require('electron');
const fs = require('fs');
const transitionLoadTime = 200;
let localRequire = null;

const prefix = createPrefix();
const unpackedPrefix = createPrefix(true);

let isRendering = false;

// File

function createPrefix(isUnpacked = false) {
    let string = remote.app.getAppPath().replace(/\\/g, '/');
    if (string.charAt(string.length - 1) !== '/') {
        string += '/';
    }
    if (isUnpacked) {
        string = string.replace('.asar', '.asar.unpacked');
    }
    return string;
}

function fileExists(path, isUnpacked = false) {
    const address = isUnpacked ? unpackedPrefix + path : prefix + path;
    console.log('fileExists: ' + address);
    return fs.existsSync(address);
}

function loadFile(path, isUnpacked = false) {
    const address = isUnpacked ? unpackedPrefix + path : prefix + path;
    console.log('loadFile: ' + address);
    return fs.readFileSync(prefix + path, 'utf8');
}

function deleteFile(path, isUnpacked = false) {
    const address = isUnpacked ? unpackedPrefix + path : prefix + path;
    console.log('deleteFile: ' + address);
    fs.unlinkSync(address);
}

function saveFile(path, string, isUnpacked = false) {
    const address = isUnpacked ? unpackedPrefix + path : prefix + path;
    console.log('saveFile: ' + address);
    fs.writeFileSync(prefix + path, string);
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
    if (!localRequire) {
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
    const toolbarItems = document.getElementsByClassName('toolbar-item');
    for (const toolbarItem of toolbarItems) {
        const classes = toolbarItem.classList;
        if (classes.contains('toolbar-item-selected') && toolbarItem !== element) {
            classes.remove('toolbar-item-selected');
        }
    }
    if (element.parentElement) {
        element.parentElement.classList.add('toolbar-item-selected');
    }

    const content = document.getElementById('content');

    content.innerHTML = loadFile(`app/tabs/${target}.html`);

    if (fileExists(`app/assets/js/${target}.js`)) {
        localRequire = require(`./../assets/js/${target}`);
        localRequire.load();
    }
}

function init() {
    const toolbar = document.getElementById('toolbar');
    const initialTab = toolbar.getAttribute('data-initial-tab');
    loadCSSFiles();
    if (initialTab) {
        loadTab(initialTab, document.querySelector(`[alt="${initialTab}"]`));
    }
}

document.addEventListener('DOMContentLoaded', init);