
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
    constructor(obj) {
        this.id = undefined
        this.description = 'An empty room.'
        this.name = undefined 
        this.exits = {}
        this.items = []
        this.mobs = []

        obj && Object.assign(this, obj); // copy constructor
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

    addItem(item) {
        this.items.push(item) 
        return true
    }
    takeItem(item, target) {
        var index = this.items.findIndex(_ => _.id == item.id)
        if (index != -1) {
            target.inventory.addItem(this.items[index]) // give item to target
            this.items.splice(index, 1) // remove from room
            return true
        }
        return false
    }
    findItemByName(itemName) {
        var itemName = itemName.toLowerCase()
        return this.items.find(_ => _.name.toLowerCase() == itemName)
    }

    addMob(mob) {
        this.mobs.push(mob)
    }
    killMob(mob) {
        var index = this.mobs.findIndex(_ => _.id == mob.id)
        if (index) {
            this.mobs.splice(index, 1)
            return true
        }
        return false
    }
}


module.exports = Room