const electron = require('electron');
const url = require('url');
const path = require('path');

const renamer = require('./renamer');
function run(){
    renamer.runRenamer();
};
function renamed(){
    renamer.renamed();
};

const {app, BrowserWindow, Menu, ipcMain, dialog, os} = electron;


//set environment, (toggle Dev Tools)
//process.env.NODE_ENV = 'production';

let mainWindow;
//let addWindow;
process.on('uncaughtException', function (error) {
    console.log(error)
})
//listen for app ready
app.on('ready', function() {
    //create new window
    mainWindow = new BrowserWindow({
        width: 500,
        resizable: true,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
    }
    });
       
//load html file
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file',
        slashes: true
    }));
    //quit app when closed
    mainWindow.on('closed', function(){
        app.quit();
    });

    //build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //insert menu
    Menu.setApplicationMenu(mainMenu);
});

//set variables to none
let projectCode = '';
let txtFile = '';
let folderURL = ''

//catch projectcode
ipcMain.on('projectcode-set', function (event, data) {
    setProjectCode(data);
});

//sets project code from user selection
function setProjectCode(data){
    projectCode = data;
    console.log('set the code to:');
    console.log(projectCode);
};

//sets exported function to user selection
function exporter() {
    if (projectCode !== '' && txtFile !== '' && folderURL !== '') {
        module.exports = { projectCode, txtFile, folderURL };
        run();
        renamed();
    } else {
        console.log('one or more options not set');
    }
};

//choose file button
    ipcMain.on('open-file-dialog-for-file', function (event) {
        dialog.showOpenDialog({
        properties: ['openFile']
        }, function (files) {
            if (files) event.sender.send('selected-file', files[0]);
        });
    });

//set file path url
    ipcMain.on('file-url', function (event, path) {
        setFilePath(path);
    });

    function setFilePath(path) {
        txtFile = path;
    };

//choose folder button
    ipcMain.on('open-folder-dialog-for-folder', function (event) {
    dialog.showOpenDialog({
            properties: ['openDirectory']
        }, function (folder) {
            if (folder) event.sender.send('selected-folder', folder[0]);
        });
});

//set folder path url
    ipcMain.on('folder-url', function (event, folderPath) {
        setFolderPath(folderPath);
    });

    function setFolderPath(folderPath) {
        folderURL = folderPath;
    };

//rename button
ipcMain.on('rename', function () {
        console.log('starting renamer');
        console.log(projectCode);
        console.log(txtFile);
        console.log(folderURL);
        exporter();
});

//menu template
const mainMenuTemplate = [
    {
    label: 'Options',
    submenu:[
        {
            label: 'Quit',
            accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
            click(){
                app.quit();
                }
        },
        {
            label: 'Dark Mode',
            accelerator: process.platform == 'darwin' ? 'Command+D' : 'Ctrl+D',
            click(){              
                mainWindow.webContents.send('darkmode')
            }
        }
    ]
    }
];

//mac file button creator
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
}

//Developer tools if not in production
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu:[
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
};