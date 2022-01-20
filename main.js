const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;
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

//default pop up window size
const defaultWidth = 350
const defaultHeight = 150


//create project code window
function createprojectCodeWindow(){
    //create new window
    projectCodeWindow = new BrowserWindow({
        width: defaultWidth,
        height: defaultHeight,
        title: 'Specify the project code'    
    });
    //load html file
    projectCodeWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'projectCodeWindow.html'),
        protocol: 'file',
        slashes: true
    }));
    //garbage collection, saves memory?
    projectCodeWindow.on('close', function(){
        addWindow = null;
    })
}
//catch projectcode
ipcMain.on('projectcode:add', function(event, projectcode){
    console.log(projectcode);
    mainWindow.webContents.send('projectcode:add', projectcode);
    projectCodeWindow.close();
})

//dialog.showOpenDialoSync([browserWindow])

//create selectFolder location window
function createSelectFolderWindow(){
    //create new window
    const selectFolderWindow = new BrowserWindow({
        width: defaultWidth,
        height: defaultHeight,
        title: 'Specify the txt file location'
    });
    //load html file
    selectFolderWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'selectFolderWindow.html'),
        protocol: 'file',
        slashes: true
    }));
    //garbage collection, saves memory?
    selectFolderWindow.on('close', function(){
        addWindow = null;
    })
}

//menu template
const mainMenuTemplate = [
    {
    label: 'File',
    submenu:[
        {
            label: 'project code',
            click(){
                createprojectCodeWindow();
            }
        },
        {
            label: 'txt file location'
        },
        {
            label: 'pdf folder location'
        },
        {
            label: 'Quit',
            accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
            click(){
            app.quit();
                }
            }
        ]
    },
    {
        label: 'Select Folder',
        click(){
            createSelectFolderWindow();
        }
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
}
