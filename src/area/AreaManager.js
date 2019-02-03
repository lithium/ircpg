const IrcpgModule = require('../modules/IrcpgModule')

class AreaManager extends IrcpgModule 
{
    load() {
        super.load()

        this.addAction("look", this.actionLook);
        this.addAction("go", this.actionGo);
        this.addAction("pickup", this.actionPickup);
    }

    unload() {
        super.unload()
    }


    actionLook(character, channel, argv, msg) {
        var room = channel.area.currentRoom
        if (argv.length > 1) {
            var target = argv.slice(1).join(" ").toLowerCase()
            var item = room.findItemByName(target)
            if (item) {
                this.describeItem(channel, item)
                return
            }
        }
        this.describeRoom(channel, room)
    }

    actionGo(character, channel, argv, msg) {
        if (argv.length < 2) {
            return
        }

        var direction = argv[1]
        var room = channel.area.currentRoom
        var exit = room.getExit(direction)

        if (exit) {
            channel.area.currentRoomId = exit.destinationId
            this.describeRoom(channel)
        }
    }

    actionPickup(character, channel, argv, msg) {
        if (argv.length < 2) {
            return
        }

        var target = argv.slice(1).join(" ").toLowerCase()
        var room = channel.area.currentRoom
        var item = room.findItemByName(target)
        if (!item) {
            return;
        }
        if (item.holdable) {
            room.takeItem(item, character)
            this.client.say(channel.name, `${character.nick} takes ${item.name}.`)
        } else {
            this.client.say(channel.name, `${character.nick} tries to pickup ${item.name} but cannot.`)
        }
    }

    describeItem(channel, item) {
        var descr;
        if (item.description) {
            descr = item.description
        } else {
            descr = `It is a ${item.name}.`
        }
        this.client.say(channel.name, descr)
    }

    describeRoom(channel, room) {
        var exitNames = Object.keys(room.exits)
        var holdableItems = room.items.filter(_ => _.holdable)
        var out = [
            room.name ? `${room.name}: ${room.description}` : room.description,
        ]
        if (exitNames.length > 0) {
            out.push(`Exits: ${Object.keys(room.exits).join(", ")}`)
        }
        if (holdableItems.length > 0) {
            out.push(`Items: ${holdableItems.map(_ => _.name).join(", ")}`)
        }

        out.forEach(_ => {
            this.client.say(channel.name, _)
        })

    }


}


module.exports = AreaManager