const irc = require("irc")
const invalidate = require('invalidate-module');

var IrcpgModule = require('./modules/IrcpgModule')


class Dmbot extends IrcpgModule {
    constructor(config, installed_modules) {
        super()
        this.config = config
        this.client = undefined
        this.loaded_modules = {}
        this.installed_modules = installed_modules || []
        this.installed_modules.forEach(function(m) {
            this.load_module(m)
        }.bind(this))
    }

    connect() {
        this.client = new irc.Client(this.config.server, this.config.nick, {
            port: this.config.port,
            userName: this.config.userName,
            realName: this.config.realName,
            channels: this.config.channels,
            debug: this.config.debug,
            secure: true,
            selfSigned: true,
            certExpired: true,
            floodProtection: true
        })
        this.reload()
        this.addHandler("message", this.handleMessage)
    }


    reload() {
        Object.keys(this.loaded_modules).forEach(function(m) {
            this.unload_module(m)
            this.load_module(m)
        }.bind(this))
    }    

    unload_module(module_name) {
        if (module_name in this.loaded_modules) {
            this.loaded_modules[module_name].unload()
            invalidate(require.resolve(`./modules/${module_name}`))
            delete this.loaded_modules[module_name]
        } 
    }

    load_module(module_name) {
        var module_cls = require(`./modules/${module_name}`)
        this.loaded_modules[module_name] = new module_cls(this.client)
    }

    authenticateAdminUser(msg) {
        return (this.config.admins.indexOf(msg.nick) != -1)
    }

    handleMessage(from, to, txt, msg) {
        if ((to == this.config.nick) && this.authenticateAdminUser(msg)) {
            var words = txt.split(/\s+/)
            if (words[0] == "reload") {
                this.reload()
            }
            else if (words[0] == "load" && words.length > 1) {
                this.load_module(words[1])
            }
            else if (words[0] == "unload" && words.length > 1) {
                this.unload_module(words[1])
            }
        }
    }
}


module.exports = {
    Dmbot: Dmbot,
}
