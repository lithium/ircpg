
class IrcpgModule {
    constructor(dependencies) {
        Object.keys(dependencies || {}).forEach(_ => this[_] = dependencies[_])
        
        this.handlers = {};
        this.pending_handlers = [];
        this.commands = {};
        this.actions = {};

        this.load();
    }

    onConnect() {
        var pending = this.pending_handlers;
        this.pending_handlers = {}
        pending.forEach(([name, method]) => this.addHandler(name, method))
    }

    load() {
        this.addHandler("pm", this.handlePmForCommand)
        this.addHandler("action", this.handleActionForCommand)
    }

    unload() {
        this.removeHandler("pm", this.handlePmForCommand)
        this.removeHandler("action", this.handleActionForCommand)
    }

    /* irc event handlers */
    addHandler(eventName, method) {
        if (this.client) {
            var callback = method.bind(this)
            this.client.addListener(eventName, callback)
            this.handlers[method] = callback
        } else {
            this.pending_handlers.push([eventName, method])
        }
    }
    removeHandler(eventName, method) {
        if (method in this.handlers) {
            this.client.removeListener(eventName, this.handlers[method]);
        }
    }

    /* pm commands */
    addCommand(commandName, callback) {
        this.commands[commandName.toUpperCase()] = callback; 
    }
    removeCommand(commandName, callback) {
        delete this.commands[commandName.toUpperCase()];
    }
    handlePmForCommand(from, txt, msg) 
    {
        var argv = txt.split(/\s+/)
        var cmd = argv[0].toUpperCase()
        var method = this.commands[cmd]
        if (method) {
            method.bind(this)(from, argv, msg)
        }
    }

    /* channel actions */
    addAction(actionName, callback) {
        this.actions[actionName.toUpperCase()] = callback; 
    }
    removeAction(actionName, callback) {
        delete this.actions[actionName.toUpperCase()];
    }
    handleActionForCommand(from, to, txt, msg) 
    {
        if (Object.keys(this.actions).length > 0 && to.startsWith('#')) {
            this.channelService.getOrCreate(to).then(channel => {
                this.characterService.getByNick(from).then(character => {

                    var argv = txt.split(/\s+/)
                    var cmd = argv[0].toUpperCase()
                    var method = this.actions[cmd]
                    if (method) {
                        method.bind(this)(character, channel, argv, msg)
                    }

                }, err => {
                    // ignore actions from unregistered nicks
                })
            }, err => {
                console.log(`unable to find Channel for ${to} !`)
            })
        }

    }


    require_usage(argv, msg, requiredNumberOfArguments, usage) {
        if (argv.length < requiredNumberOfArguments+1) {
            this.client.say(msg.nick, `Usage: ${argv[0]} ${usage}`)
            return false;
        }
        return true;
    }

}

module.exports = IrcpgModule
