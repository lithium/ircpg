
const uuid4 = require('uuid/v4')


class Item
{
    constructor(obj) {
        this.id = undefined
        this.name = undefined
        this.description = undefined
        this.type = undefined 

        this.holdable = false   // can this item be in an inventory
        this.openable = false
        this.inventory = undefined

        obj && Object.assign(this, obj); // copy constructor
    }
    get id() { return this._id }
    set id(id) { this._id = id || uuid4() }

}

module.exports = Item