
const MongoService = require('./MongoService')
const Character = require('../models/Character')

class CharacterService extends MongoService
{
    onConnect() {
        this.collection = this.db.collection('characters')
    }

    getByNick(nick) {
        console.log("characterService.getByNick", nick)
        return this.collection.findOne({"nick": nick})
    }

    authenticate(character, msg) {
       console.log("authenticate") 
    }

    createNewCharacter(nick, password, msg) {
       var character = new Character({nick: nick})
       character.set_password(password)

       return character
    }
}

module.exports = CharacterService
