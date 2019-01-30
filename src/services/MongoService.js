const mongodb = require('mongodb')

class MongoService 
{
    constructor(options) {
        this.options = Object.assign({}, options || {})
        this.client = undefined
        this.db = undefined

        this.connect()
    }

    connect() {
        mongodb.MongoClient.connect(this.get_db_url(), (err, client) => {
            if (err) {
                console.log(err)
            } else {
                this.client = client
                this.db = client.db(this.get_db_name())
                this.onConnect()
            }
        })
    }

    onConnect() {}

    get_db_url() {
        return this.options.url || 'mongodb://localhost:27017'
    }

    get_db_name() {
        return this.options.db_name || 'ircpg'
    }
}

module.exports = MongoService