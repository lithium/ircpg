const Room = require('./Room')

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
        var demoRoom = new Room('demo', "An empty test room", "Demo Room")
        var northRoom = new Room('north', "It is dark and dank here.")

        demoRoom.addExitToRoom('north', northRoom, 'south')

        this.addRoom(demoRoom)
        this.addRoom(northRoom)
        this.currentRoomId = demoRoom.id
    } 
}

module.exports = Area