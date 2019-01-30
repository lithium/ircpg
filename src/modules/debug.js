var IrcpgModule = require('./IrcpgModule')


class DebugModule extends IrcpgModule {

    constructor(client) {
        super(client)

        this.addHandler("message", this.handleMessage);
    }

    load() {
        this.version = 'v1'
        console.log(`load ${this.version}`)
    }

    unload() {
        console.log(`unload ${this.version}`)
        this.removeHandler("message", this.handleMessage);
    }

    handleMessage(from, to, text, msg) {
        console.log(`${this.version} [${to}] <${from}> ${text}`);
    }

}


module.exports = DebugModule