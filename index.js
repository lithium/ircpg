
var ircpg = require("./src/ircpg")
var config = require("./config.js")


var dmbot = new ircpg.Dmbot(config)
dmbot.connect()
