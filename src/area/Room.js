
const uuid4 = require('uuid/v4')


class Exit
{
    constructor(direction, destinationId) {
        this.direction = direction
        this.destinationId = destinationId
    }
}

class Room 
{
    constructor(id, description, name) {
        this.id = id
        this.description = description || 'An empty room.'
        this.name = name 
        this.exits = {}
    }

    get id() { return this._id }
    set id(id) { this._id = id || uuid4() }

    addExit(direction, exit) {
        this.exits[direction] = exit
    }

    getExit(direction) {
        return this.exits[direction]
    }

    addExitToRoom(direction, room, oppositeDirection) {
        var ourExit = new Exit(direction, room.id)
        var theirExit = new Exit(oppositeDirection, this.id)

        this.addExit(direction, ourExit)
        room.addExit(oppositeDirection, theirExit)
    }
}


module.exports = Room