
class CharacterService {
    constructor() {
        console.log("character service constructor")
    }

    getByNick(nick) {
        console.log("characterService.getByNick", nick)
    }
}

module.exports = CharacterService
