
class IrcpgModule {
    constructor(client) {
        this.handlers = {};
        this.pending_handlers = [];
        this.client = client;
        this.commands = {};

        this.load();
    }

    onConnect() {
        var pending = this.pending_handlers;
        this.pending_handlers = {}
        pending.forEach(([name, method]) => this.addHandler(name, method))
    }

    load() {
        this.addHandler("pm", this.handlePmForCommand);
    }

    unload() {
        this.removeHandler("pm", this.handlePmForCommand);
    }

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

    require_usage(argv, msg, requiredNumberOfArguments, usage) {
        if (argv.length < requiredNumberOfArguments+1) {
            this.client.say(msg.nick, `Usage: ${argv[0]} ${usage}`)
            return false;
        }
        return true;
    }

}

module.exports = IrcpgModule
