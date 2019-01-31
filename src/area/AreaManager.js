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
        this.describeRoom(channel)
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

    describeRoom(channel) {
        if (!channel.area) {
            return;
        }

        var room = channel.area.currentRoom
        if (!room) {
            return;
        }

        var out = [
            room.name ? `${room.name}: ${room.description}` : room.description,
            `Exits: ${Object.keys(room.exits).join(", ")}`
        ]

        out.forEach(_ => {
            this.client.say(channel.name, _)
        })

    }


}


module.exports = AreaManager