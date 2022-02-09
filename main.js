const electron = require('electron');
const url = require('url');
const path = require('path');

const renamer = require('./renamer');
function run(){
    renamer.runRenamer();
};

const {app, BrowserWindow, Menu, ipcMain, dialog, os} = electron;

let mainWindow;
//let addWindow;
process.on('uncaughtException', function (error) {
    console.log(error)
})
//listen for app ready
app.on('ready', function() {
    //create new window
    mainWindow = new BrowserWindow({});
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

//catch projectcode
let projectCode = 'XXXXX';

ipcMain.on('projectcode-set', function (event, data) {
    console.log(projectCode);
    console.log(data);
    setProjectCode(data);
    console.log(projectCode);
    /*
    function setProjectCode(data){
        projectCode = data;
        console.log('set the code to:');
        console.log(projectCode);
        */
    //};
//setProjectCode();
});


//choose file button
    ipcMain.on('open-file-dialog-for-file', function (event) {
    dialog.showOpenDialog({
        properties: ['openFile']
        }, function (files) {
            if (files) event.sender.send('selected-file', files[0]);
            let txtFile = files[0];        
            console.log(txtFile);
        });
    });

//choose folder button
    ipcMain.on('open-folder-dialog-for-folder', function (event) {
    dialog.showOpenDialog({
            properties: ['openDirectory']
        }, function (folder) {
            if (folder) event.sender.send('selected-folder', folder[0]);
            folderLocation = folder[0];
            console.log(folderLocation);
        });
});

//rename button
ipcMain.on('rename', function () {
        console.log('woulda run');
        console.log(projectCode);
        exporter();
        run();
});

//menu template
const mainMenuTemplate = [
    {
    label: 'File',
    submenu:[
        {
            label: 'Quit',
            accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
            click(){
            app.quit();
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

function setProjectCode(data){
    projectCode = data;
    console.log('set the code to:');
    console.log(projectCode);
    
};

function exporter(setProjectCode) {
    if (projectCode !== 'XXXXX') {
        module.exports = { projectCode };
    } else {
        setProjectCode();
    }
};


//test button area
/*
extra code to handle platform, to look into
issues with os defined in require
issues with cannot read property platform of undefined
platform, restructured to darwin

ipcMain.on('open-file-dialog-for-file', function (event) {
    if(os.platform() === 'linux' || os.platform() === 'win32'){
        dialog.showOpenDialog({
            properties: ['openFile']
        }, function (files) {
            if (files) event.sender.send('selected-file', files[0]);
        });
    } else {
            dialog.showOpenDialog({
                properties: ['openFiles', 'openDirectory']
            }, function (files) {
                if (files) event.sender.send('selected-file', file[0]);
            });
    }});
    */