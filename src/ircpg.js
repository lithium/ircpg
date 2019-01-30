const irc = require("irc")
const invalidate = require('invalidate-module');

var IrcpgModule = require('./modules/IrcpgModule')


class AuthenticatedAdmin {
    constructor(account, nick, user, host) {
        this.account = account
        this.nick = nick
        this.user = user
        this.host = host
    }

    equals(other) {
        return (
            this.nick === other.nick &&
            this.user === other.user && 
            this.host === other.host
        )
    }
}


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


        this.commands = {
            'admin': this.handleAdmin,
            'reload': this.handleReload,
            'load': this.handleLoad,
            'unload': this.handleUnload,
            'shutdown': this.handleShutdown
        }

        this.admins = {}
    }

    connect() {
        var irc_config = Object.assign({
            port: 6667,
            userName: 'dmbot',
            realName: 'dungeon master',
            channels: [],
            debug: false,
            secure: true,
            selfSigned: true,
            certExpired: true,
            floodProtection: true
        }, this.config.irc)
        this.client = new irc.Client(this.config.irc.server, this.config.irc.nick, irc_config)
        this.reload()
        this.addHandler("pm", this.handlePm)
    }

    shutdown(reason) {
        if (this.client) {
            this.client.disconnect(reason, _ => process.exit())
        }
    }

    /*
     * Module loading
     */

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


    /* 
     * Admin Authentication
     */

    authenticate_admin(account, msg) {
        this.admins[account] = new AuthenticatedAdmin(account, msg.nick, msg.user, msg.host)
    }
    is_admin(msg) {
        var admin = this.admins[msg.nick]
        return (admin && admin.equals(msg))
    }
    remove_admin(msg, account) {
        var account = account || msg.nick
        delete this.admins[account]
    }


    /*
     * Command Handlers
     */

    handlePm(from, txt, msg) {
        var argv = txt.split(/\s+/)

        var method = this.commands[argv[0].toLowerCase()]
        if (method) {
            method.bind(this)(from, argv, msg)
        }
    }

    handleAdmin(from, argv, msg) {
        if (argv.length < 2) {
            this.client.say(from, `Usage: ${argv[0]} [nick] <password>`)
            return
        }
        var provided_password = argv[1]
        var nick = (argv.length > 2) ? argv[1] : from
        var correct_password = this.config.admins[nick]
        if (correct_password && correct_password === provided_password) {
            this.authenticate_admin(nick, msg)
            this.client.say(from, "admin: Authenticated.")
        } else {
            this.client.say(from, "admin: Wrong username or password.")
        }
    }

    handleReload(from, argv, msg) {
        if (!this.is_admin(msg)) {
            return;
        }
        this.reload();
        this.client.say(from, "reload: Reloading.")
    }

    handleLoad(from, argv, msg) {
        if (!this.is_admin(msg)) {
            return;
        }
        if (argv.length < 2) {
            this.client.say(from, `Usage: ${argv[0]} <module>`)
            return
        }
        this.load_module(argv[1])
    }

    handleUnload(from, argv, msg) {
        if (!this.is_admin(msg)) {
            return;
        }
        if (argv.length < 2) {
            this.client.say(from, `Usage: ${argv[0]} <module>`)
            return
        }
        this.unload_module(argv[1])
    }

    handleShutdown(from, argv, msg) {
        if (!this.is_admin(msg)) {
            return;
        }
        var reason = (argv.length > 1) ? msg.args[1].replace(/^shutdown /i, '') : `shutdown requested by ${from}`
        this.client.say(from, `Shutting down (${reason}).`)
        this.shutdown(reason)
    }
}


module.exports = {
    Dmbot: Dmbot,
}
