var IrcpgModule = require('./IrcpgModule')


class CharacterManager extends IrcpgModule 
{
    load() {
        super.load()
        this.addCommand("REGISTER", this.handleRegister);
    }

    handleRegister(from, argv, msg) {
        if (!this.require_usage(argv, msg, 1, "<password>")) {
            return;
        }

        var nick = from
        var newpass = argv[1]
        console.log("register", nick, newpass)
    }
}


module.exports = CharacterManager