const irc = require("irc")
const invalidate = require('invalidate-module');

const IrcpgModule = require('./modules/IrcpgModule')


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
        this.admins = {}

        this.dependencies = {
            'characterService': './services/CharacterService'
        }
        this.injected = {}
        this.reload_dependencies()
    }

    load() {
        super.load()
        this.addCommand('admin', this.handleAdmin)
        this.addCommand('reload', this.handleReload)
        this.addCommand('load', this.handleLoad)
        this.addCommand('unload', this.handleUnload)
        this.addCommand('shutdown', this.handleShutdown)
        this.addCommand('nick', this.handleNick)
        this.addCommand('join', this.handleJoin)
        this.addCommand('part', this.handlePart)
        this.addCommand('say', this.handleSay)
        this.addCommand('send', this.handleSend)
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

        this.onConnect()
        this.load_installed_modules()
    }

    shutdown(reason) {
        if (this.client) {
            this.client.disconnect(reason, _ => process.exit())
        }
    }

    /*
     * Dependency Injetion
     */
    reload_dependencies() {
        var options = this.get_dependency_options()
        this.injected = {}

        Object.keys(this.dependencies).forEach(key => {
            var name = this.dependencies[key]
            invalidate(require.resolve(name))
            try {
                var dep = require(name)
            } catch (e) {
                console.log(`loading dependency "${name}" failed`)
                console.log(e)
                return e
            }
            this.injected[key] = new dep(options)
        })
    }

    get_dependency_options() {
        return {}
    }

    /*
     * Module loading
     */

    load_installed_modules() {
        this.installed_modules.forEach(_ => this.load_module(_))
    }

    reload_modules() {
        Object.keys(this.loaded_modules).forEach(_ => {
            this.unload_module(_)
            this.load_module(_)
        })
    }    

    unload_module(module_name) {
        if (module_name in this.loaded_modules) {
            this.loaded_modules[module_name].unload()
            invalidate(require.resolve(`./modules/${module_name}`))
            delete this.loaded_modules[module_name]
        } 
    }

    load_module(module_name) {
        this.unload_module(module_name);
        try {
            var module_cls = require(`./modules/${module_name}`)
            this.loaded_modules[module_name] = new module_cls(Object.assign({
                'client': this.client
            }, this.injected)) 
            return undefined
        } catch (e) {
            console.log(`loading module "${module_name}" failed`)
            console.log(e)
            return e
        }
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

    require_admin_usage(argv, msg, requiredNumberOfArguments, usage) {
        if (!this.is_admin(msg)) {
            return false;
        }
        if (!this.require_usage(argv, msg, requiredNumberOfArguments, usage)) {
            return false;
        }
        return true;
    }

    /*
     * Admin Command Handlers
     */

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
        if (!this.require_admin_usage(argv, msg, 0)) {
            return;
        }
        this.reload_dependencies();
        this.reload_modules();
        this.client.say(from, "reload: Reloading.")
    }

    handleLoad(from, argv, msg) {
        if (!this.require_admin_usage(argv, msg, 1, '<module>')) {
            return;
        }
        var err = this.load_module(argv[1])
        if (err) {
            this.client.say(from, `load: failed to load "${argv[1]}" (${err})`)
        } else {
            this.client.say(from, `load: "${argv[1]}" loaded successfully.`)
        }
    }

    handleUnload(from, argv, msg) {
        if (!this.require_admin_usage(argv, msg, 1, '<module>')) {
            return;
        }
        this.unload_module(argv[1])
    }

    handleShutdown(from, argv, msg) {
        if (!this.require_admin_usage(argv, msg, 0, '[reason]')) {
            return;
        }

        var reason = (argv.length > 1) ? msg.args[1].replace(/^shutdown /i, '') : `shutdown requested by ${from}`
        this.client.say(from, `Shutting down (${reason}).`)
        this.shutdown(reason)
    }

    handleNick(from, argv, msg) {
        if (!this.require_admin_usage(argv, msg, 1, '<nickname>')) {
            return;
        }
        this.client.send("NICK", argv[1])
    }
    handleJoin(from, argv, msg) {
        if (!this.require_admin_usage(argv, msg, 1, '#channel')) {
            return;
        }
        this.client.join(argv[1])
    }
    handlePart(from, argv, msg) {
        if (!this.require_admin_usage(argv, msg, 1, '#channel')) {
            return;
        }
        this.client.part(argv[1])
    }
    handleSay(from, argv, msg) {
        if (!this.require_admin_usage(argv, msg, 2, '<to> message follows...')) {
            return;
        }

        var target = argv[1]
        var message = msg.args[1].replace(/^say /i, '')
        var message = message.replace(`${target} `, '')
        this.client.say(target, message)
    }
    handleSend(from, argv, msg) {
        if (!this.require_admin_usage(argv, msg, 2, 'RAW IRC COMMAND')) {
            return;
        }
        var args = argv.slice(1)
        this.client.send.apply(this.client, args)
    }
}


module.exports = {
    Dmbot: Dmbot,
}
