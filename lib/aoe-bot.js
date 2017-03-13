// lib/aoe-bot.js

'use strict';

var util = require("util");
var path = require("path");
var fs = require("fs");
var Bot = require("slackbots");

class AoeBot extends Bot {
    constructor(settings) {
        super(settings);
        this.settings = settings;
        this.settings.name = this.settings.name || "aoe";
        this.dbPath = settings.dbPath || path.resolve(process.cwd(), 'data', 'aoe-bot.txt');
        this.user = null;
    }
}

util.inherits(AoeBot, Bot);

AoeBot.prototype.run = function () {
    // AoeBot.super_.call(this, this.settings);

    this.on("start", this._onStart);
    this.on("message", this._onMessage);
};

AoeBot.prototype._onStart = function () {
    this._loadBotUser();
    this._connectDb();
    this._firstRunCheck();
};

AoeBot.prototype._loadBotUser = function () {
    var self = this;
    console.log("search name: ", self.name);
    var found = this.users.some(function (user) {
        console.log(user.name);
        if (user.name === self.name)
        {
            self.user = user;
            return true;
        }
    });
    if (!found) {
        console.log("Cannot find user ")
    }
};

AoeBot.prototype._connectDb = function () {
    var self = this;
    if (!fs.existsSync(self.dbPath)) {
        fs.writeFile(self.dbPath, "HEADER", {flag: "w"}, function (err) {
            if (err) console.log("CREATE FILE ERROR: ", err);
            console.log("HEADER > " + self.dbPath);
        })
    }
};

AoeBot.prototype._firstRunCheck = function () {
    var self = this;
    self._initDb
    fs.readFile(self.dbPath, function(err, data) {
        if (err) {
            return console.error("READ FILE ERROR: ", err);
        }
        var currentTime = (new Date()).toJSON();

        // length check comes from "HEADER" string length
        if (data.length < 7) {
            self._welcomeMessage();
            fs.appendFile(self.dbPath, "\n", function (err) {
                if (err) {
                    return console.error("INIT FILE ERROR: ", err);
                }
            });
        }
        fs.appendFile(self.dbPath, "LastLogin: " + currentTime, function (err) {
                if (err) {
                    return console.error("INIT FILE ERROR: ", err);
                }
            });
    })
};

AoeBot.prototype._welcomeMessage = function () {
    this.postMessageToChannel(this.channels[0].name, "What age are you in?" + 
    "\n I respond to AoE chat command numbers. Start any message with a number and I will play your taunt.",
    {as_user: true});
};

AoeBot.prototype._onMessage = function (message) {
    console.log(message);
    if (this._isChatMessage(message) && 
        !this._isFromAoeBot(message) &&
        this._isTauntMessage(message)){
            this._replyWithSound(message);
        }
};

AoeBot.prototype._isChatMessage = function (message) {
    return message.type === "message" && Boolean(message.text);
};

AoeBot.prototype._isFromAoeBot = function (message) {
    return message.user === this.user.id;
};

AoeBot.prototype._isTauntMessage = function (message) {
    return message.text.length > 0 && 
    message.text.length < 3 && // done consider numbers larger than 99
    parseInt(message.text, 10) > -1;
};

AoeBot.prototype._replyWithSound = function (originalMessage) {
    console.log("reply started");
    var channel = this._getChannelById(originalMessage.channel);
    var message = this._getAoeMessage(originalMessage);
    // this.updateMessage(originalMessage.channel, originalMessage.ts, newMessage, {as_user: true})
    // .then((err) => {
    //     console.log("Err: ", err);
    // });
    this.postMessageToChannel(channel.name, message, {as_user: true}, (response) => {
        console.log(response);
    })
};

AoeBot.prototype._getChannelById = function (channelId) {
    var channel = null;
    this.channels.some(function (item) {
        if (item.id = channelId) {
            channel = item;
            return true;
        }
    });
    return channel;
};

AoeBot.prototype._getAoeMessage = function (originalMessage) {
    var message;
    switch (parseInt(originalMessage.text)) {
        case 1:
            message = "Yes.";
            break;
		case 2:
			message = "No.";
			break;
		case 3:
			message = "Food please.";
			break;
		case 4:
			message = "Wood please.";
			break;
		case 5:
			message = "Gold please.";
			break;
		case 6:
			message = "Stone please.";
			break;
		case 7:
			message = "Ahh!";
			break;
		case 8:
			message = "All hail, king of the losers!";
			break;
		case 9:
			message = "Ooh!";
			break;
		case 10:
			message = "I'll beat you back to Age of Empires.";
			break;
		case 11:
			message = "(Herb laugh)";
			break;
		case 12:
			message = "Ah! Being rushed.";
			break;
		case 13:
			message = "Sure, blame it on your ISP.";
			break;
		case 14:
			message = "Start the game already!";
			break;
		case 15:
			message = "Don't point that thing at me!";
			break;
		case 16:
			message = "Enemy sighted!";
			break;
		case 17:
			message = "It is good to be the king.";
			break;
		case 18:
			message = "Monk! I need a monk!";
			break;
		case 19:
			message = "Long time, no siege.";
			break;
		case 20:
			message = "My granny could scrap better than that.";
			break;
		case 21:
			message = "Nice town, I'll take it.";
			break;
		case 22:
			message = "Quit touching me!";
			break;
		case 23:
			message = "Raiding party!";
			break;
		case 24:
			message = "Dadgum.";
			break;
		case 25:
			message = "Eh, smite me.";
			break;
		case 26:
			message = "The wonder, the wonder, the... no!";
			break;
		case 27:
			message = "You played two hours to die like this?";
			break;
		case 28:
			message = "Yeah, well, you should see the other guy.";
			break;
		case 29:
			message = "Roggan.";
			break;
		case 30:
			message = "Wololo.";
			break;
		case 31:
			message = "Attack an enemy now.";
			break;
		case 32:
			message = "Cease creating extra villagers.";
			break;
		case 33:
			message = "Create extra villagers.";
			break;
		case 34:
			message = "Build a navy.";
			break;
		case 35:
			message = "Stop building a navy.";
			break;
		case 36:
			message = "Wait for my signal to attack.";
			break;
		case 37:
			message = "Build a wonder.";
			break;
		case 38:
			message = "Give me your extra resources.";
			break;
		case 39:
			message = "(Ally sound)";
			break;
		case 40:
			message = "(Enemy sound)";
			break;
		case 41:
			message = "(Neutral sound)";
			break;
		case 42:
			message = "What age are you in?"
            break;
        default:
            message = "Unknown command ☹️."
    }
    return message;
};

module.exports = AoeBot;