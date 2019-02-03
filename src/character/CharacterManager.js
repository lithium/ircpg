
const IrcpgModule = require('../modules/IrcpgModule')

const Character = require('./Character.js')


class CharacterManager extends IrcpgModule 
{
    load() {
        super.load()

        this.addCommand("REGISTER", this.commandRegister);
        this.addCommand("SET", this.commandSet);

        this.addCommand("INVENTORY", this.commandInventory);
    }


    commandRegister(from, argv, msg) {
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
                this.characterService.createNewCharacter(nick, password, msg).then(_ => 
                    this.client.say(from, "register: new character created.")
                )
            }
        })

    }

    commandSet(from, argv, msg) {
        if (!this.require_usage(argv, msg, 2, "<variable> <value>")) {
            return;
        }
        var whitelist = ['password']
        var name = argv[1].toLowerCase()
        var value = argv[2]

        if (whitelist.indexOf(name) == -1) {
            this.client.say(from, `set: unknown variable "${name}"`)
            return
        }

        this.characterService.authenticatedCharacter(msg).then(char => {
            if (name == "password") {
                char.set_password(value)
            }
            this.characterService.save(char).then(_ => {
                this.client.say(from, `set: ${name} changed.`)
            }, e => {
                this.client.say(from, `set: Unable to change ${name}.`)
            })
        }, err => {
            this.client.say(from, 'unauthenticated.')
        })
    }

    commandInventory(from, argv, msg) {
        this.characterService.authenticatedCharacter(msg).then(char => {
            this.client.say(from, `Inventory (${char.inventory.items.length}):`)
            char.inventory.items.forEach(_ => {
                this.client.say(from, _.name)
            })
        }, err => {})
    }
}


module.exports = CharacterManager