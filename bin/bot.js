// bin/bot.js

var AoEBot = require("../lib/aoe-bot");

var token = "";
var dbPath = "";
var name = "aoe";

var aoeBot = new AoEBot({
    token: token,
    dbPath: dbPath,
    name: name
});

aoeBot.run();