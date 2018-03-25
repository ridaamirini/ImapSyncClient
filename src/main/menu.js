const {app, Menu} = require('electron');

const template = [
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () { require('electron').shell.openExternal('https://ridaamirini.github.io/ImapSyncClient/'); }
      }
    ]
  }
];

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      {role: 'about'},
      {role: 'quit'}
    ]
  });

  // Window menu
  template[3].submenu = [
    {role: 'close'},
    {role: 'minimize'},
    {role: 'zoom'},
    {type: 'separator'},
    {role: 'front'}
  ];
}

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
