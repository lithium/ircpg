const IrcpgModule = require('../modules/IrcpgModule')

class AreaManager extends IrcpgModule 
{
    load() {
        super.load()

        this.addHandler("action", this.handleActionForCommand)

        this.addCommand("look", this.commandLook);
        this.addCommand("go", this.commandGo);
    }

    unload() {
        super.unload()

        this.removeHandler("action", this.handleActionForCommand)
    }


    handleActionForCommand(from, to, txt, msg) 
    {
        if (to.startsWith('#')) {
            this.channelService.getOrCreate(to).then(chan => {
                this.handlePmForCommand(from, txt, msg, chan)
            })
        }
    }

    commandLook(from, argv, msg, channel) {
        var room = channel.area.currentRoom
        if (argv.length > 1) {
            var target = argv.slice(1).join(" ").toLowerCase()
            var item = room.items.find(_ => _.name.toLowerCase() == target)
            if (item) {
                this.describeItem(channel, item)
                return
            }
        }
        this.describeRoom(channel, room)
    }

    commandGo(from, argv, msg, channel) {
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
        var out = [
            room.name ? `${room.name}: ${room.description}` : room.description,
            `Exits: ${Object.keys(room.exits).join(", ")}`,
            `Items: ${room.items.filter(_ => _.holdable).map(_ => _.name).join(", ")}`,
        ]

        out.forEach(_ => {
            this.client.say(channel.name, _)
        })

    }


}


module.exports = AreaManager