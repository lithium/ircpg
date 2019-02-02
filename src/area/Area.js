const Room = require('./Room')
const equip = require('../item/equip')
const Item = require('../item/Item')

class Area
{
    constructor() {
        this.rooms = {}
        this.currentRoomId = undefined
    }

    addRoom(room) {
        this.rooms[room.id] = room
    }

    removeRoom(room) {
        delete this.rooms[room.id]
    }

    get currentRoom() {
        return this.rooms[this.currentRoomId]
    }

    initializeDemoArea() {
        var demoRoom = new Room({
            id: 'demo', 
            description: "An empty room.  There is an altar here.", 
            name: "Demo Room"
        })
        var northRoom = new Room({
            id: 'north', 
            description: "It is dark and dank here."
        })

        demoRoom.addExitToRoom('north', northRoom, 'south')

        var dagger = new Item({
            name: "Demo Dagger",
            type: equip.EquipmentTypes.Weapon,
            holdable: true
        })
        demoRoom.addItem(dagger)

        var altar = new Item({
            name: "Altar",
            description: "This stone altar is pitted and worn",
        })
        demoRoom.addItem(altar);

        this.addRoom(demoRoom)
        this.addRoom(northRoom)
        this.currentRoomId = demoRoom.id


    } 
}

module.exports = Area