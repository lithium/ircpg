
const MongoService = require('../services/MongoService')
const Character = require('./Character')
const equip = require('../item/equip')

class CharacterService extends MongoService
{
    constructor(options) {
      super(options)

      this.authenticated = {}
    }

    onConnect() {
        this.collection = this.db.collection('characters')
    }

    hydrate(obj) {
      var char = new Character(obj);
      char.inventory = new equip.Inventory(char.inventory)
      char.equipment = new equip.EquipmentInventory(char.equipment)
      return char
    }

    getByNick(nick) {
        return this.collection.findOne({"nick": nick}).then(obj => {
          return this.hydrate(obj)
        })
    }

    authenticate(character, msg) {
      this.authenticated[character.nick] = {
        character: character,
        nick: msg.nick,
        user: msg.user,
        host: msg.host
      }
    }

    is_authenticated(msg) {
      if (msg.nick in this.authenticated) {
        const a = this.authenticated[msg.nick];
        return (a.user == msg.user && a.host == msg.host)
      }
      return false
    }

    createNewCharacter(nick, password, msg) {
       var character = new Character({nick: nick})
       character.set_password(password)

       return this.save(character)
    }

    authenticatedCharacter(msg) {
      return new Promise((resolve, reject) => {
        this.getByNick(msg.nick).then(c => {
          if (this.is_authenticated(msg)) {
            resolve(this.hydrate(c))
          } else {
            reject()
          }
        }, e => {
          reject(e)
        })
      })
    }
}

module.exports = CharacterService
