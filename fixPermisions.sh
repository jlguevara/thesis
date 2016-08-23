# used to fix permissions on the server when pulling new changes from git

chmod o+r index.html

chmod -R o+rx pop-objects
chmod o+r pop-objects/index.html
chmod o+r pop-objects/getSettings.js
chmod o+r pop-objects/game.js
chmod -R o+rx pop-objects/settings
chmod -R o+rx pop-objects/images/
chmod -R o+rx pop-objects/sounds/

chmod -R o+rx avoid-objects
chmod o+r avoid-objects/index.html
chmod o+r avoid-objects/getSettings.js
chmod o+r avoid-objects/game.js
chmod -R o+rx avoid-objects/settings
chmod -R o+rx avoid-objects/images/
chmod -R o+rx avoid-objects/sounds/
