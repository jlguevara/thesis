# used to fix permissions on the server when pulling new changes from git

chmod o+r index.html

chmod -R o+rx game-engine
chmod o+r game-engine/index.html
chmod o+r game-engine/getSettings.js
chmod o+r game-engine/game.js
chmod -R o+rx game-engine/settings
chmod -R o+rx game-engine/images/
chmod -R o+rx game-engine/sounds/

chmod -R o+rx avoid-objects
chmod o+r avoid-objects/index.html
chmod o+r avoid-objects/getSettings.js
chmod o+r avoid-objects/game.js
chmod -R o+rx avoid-objects/settings
chmod -R o+rx avoid-objects/images/
chmod -R o+rx avoid-objects/sounds/
