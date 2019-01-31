

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


module.exports = Channel