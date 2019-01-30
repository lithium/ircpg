const IrcpgModule = require('./IrcpgModule')
const Character = require('../models/Character')

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
        var password = argv[1]

        this.characterService.getByNick(nick).then(c => {
            if (c) {
                var character = new Character(c)
                if (!character.check_password(password)) {
                    this.client.say(from, "register: unable to authenticate.")
                } else {
                    this.characterService.authenticate(character, msg)
                    this.client.say(from, "register: authenticated.")
                }
            } else {
                this.characterService.createNewCharacter(nick, password, msg)
                this.client.say(from, "register: new character created.")
            }
        })

    }
}


module.exports = CharacterManager