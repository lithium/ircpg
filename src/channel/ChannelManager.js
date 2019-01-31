
const IrcpgModule = require('../modules/IrcpgModule')
const Channel = require('./Channel')


class ChannelManager extends IrcpgModule 
{
    load() {
        super.load()

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



    handleInvites(channel, from, message) {
        this.client.join(channel)
    }
    handleNames(channel, nicks) {
        this.channelService.getOrCreate(channel).then(chan => {
            Object.keys(nicks).forEach(_ => chan.join(_, nicks[_]))
        })
    }
    handleJoins(channel, nick, msg) {
        this.channelService.getOrCreate(channel).then(chan => chan.join(nick))
    }
    handleNicks(oldnick, newnick, channels, msg) {
        channels.forEach(channel => {
            this.channelService.getOrCreate(channel).then(chan => 
                chan.nickchange(oldnick, newnick)
            )
        })
    }


    handleParts(channel, nick, msg) {
        this.channelService.getOrCreate(channel).then(chan => chan.leave(nick))
    }
    handleKicks(channel, nick, by, reason, msg) {
        this.channelService.getOrCreate(channel).then(chan => chan.leave(nick))
    }
    handleQuits(nick, reason, channels, msg) {
        channels.forEach(channel => {
            this.channelService.getOrCreate(channel).then(chan => chan.leave(nick))
        })
    }
}

module.exports = ChannelManager

