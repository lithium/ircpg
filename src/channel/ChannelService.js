const MongoService = require('../services/MongoService')

const Channel = require('./Channel')

class ChannelService extends MongoService
{
    constructor(options) {
        super(options)
        this.channels = {}
    }

    getOrCreate(channel) {
        return new Promise((resolve, reject) => {
            var chan = this.channels[channel]
            if (!chan) {
                chan = new Channel(channel)
                this.channels[channel] = chan
            }
            resolve(chan)
        })
    }
}

module.exports = ChannelService