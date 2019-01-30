
class IrcpgModule {
    constructor(client) {
        this.handlers = {};
        this.client = client;
        this.load();
    }

    load() {}
    unload() {}

    addHandler(eventName, method) {
        if (this.client) {
            var callback = method.bind(this)
            this.client.addListener(eventName, callback)
            this.handlers[method] = callback
        }
    }

    removeHandler(eventName, method) {
        if (method in this.handlers) {
            this.client.removeListener(eventName, this.handlers[method]);
        }
    }

}

module.exports = IrcpgModule
