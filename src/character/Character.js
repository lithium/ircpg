
const crypto = require('crypto')
const equip = require('../item/equip')
const Mob = require('../mob/Mob')

class Character extends Mob
{
    constructor(obj) {
        super(obj)
        this.nick = undefined
        this.password = undefined

        obj && Object.assign(this, obj) // copy construtor
    }

    set_password(plaintext) {
        this.password = crypto.createHash('sha256').update(plaintext).digest('base64')
    }
        
    check_password(plaintext) {
        if (this.password) {
            var hashed = crypto.createHash('sha256').update(plaintext).digest('base64')
            if (hashed === this.password) {
                return true
            }
        }
        return false
    }
}

module.exports = Character