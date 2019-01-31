
const IrcpgModule = require('../modules/IrcpgModule')


class Channel
{
    constructor(name) {
        this.name = name
        this.members = {}
        this.area = undefined
    }

    join(nick, mode) {
        var mode = mode || ''
        if (this.members[nick] === undefined) {
            this.members[nick] = mode
        }
    }
    leave(nick) {
        if (this.members[nick] !== undefined) {
            delete this.members[nick]
        }
    }

    nickchange(oldnick, newnick) {
        if (this.members[oldnick] !== undefined) {
            this.members[newnick] = this.members[oldnick]
            delete this.members[oldnick]
        }
    }
}



class ChannelManager extends IrcpgModule 
{
    load() {
        super.load()
        this.channels = {}

        this.addHandler("invite", this.handleInvites);
        this.addHandler("names", this.handleNames);
        this.addHandler("join", this.handleJoins);
        this.addHandler("part", this.handleParts);
        this.addHandler("quit", this.handleQuits);
        this.addHandler("kill", this.handleQuits);
        this.addHandler("nick", this.handleNicks);
        this.addHandler("kick", this.handleKicks);

    }

    unload() {
        super.unload()

        this.removeHandler("invite", this.handleInvites);
        this.removeHandler("names", this.handleNames);
        this.removeHandler("join", this.handleJoins);
        this.removeHandler("part", this.handleParts);
        this.removeHandler("quit", this.handleQuits);
        this.removeHandler("kill", this.handleQuits);
        this.removeHandler("nick", this.handleNicks);
        this.removeHandler("kick", this.handleKicks);
    }

    get_or_create(channel) {
        var chan = this.channels[channel]
        if (!chan) {
            chan = new Channel(channel)
            this.channels[channel] = chan
        }
        return chan
    }


    handleInvites(channel, from, message) {
        this.client.join(channel)
    }
    handleNames(channel, nicks) {
        var chan = this.get_or_create(channel)
        Object.keys(nicks).forEach(_ => chan.join(_, nicks[_]))
    }
    handleJoins(channel, nick, msg) {
        var chan = this.get_or_create(channel)
        chan.join(nick)
    }
    handleNicks(oldnick, newnick, channels, msg) {
        channels.forEach(channel => {
            var chan = this.get_or_create(channel)
            chan.nickchange(oldnick, newnick)
        })
    }


    handleParts(channel, nick, msg) {
        var chan = this.get_or_create(channel)
        chan.leave(nick)
    }
    handleKicks(channel, nick, by, reason, msg) {
        var chan = this.get_or_create(channel)
        chan.leave(nick)
    }
    handleQuits(nick, reason, channels, msg) {
        channels.forEach(channel => {
            var chan = this.get_or_create(channel)
            chan.leave(nick)
        })
    }
}

module.exports = ChannelManager

