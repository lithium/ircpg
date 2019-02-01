

function randomid()
const identity = require('../identity')
const uuid4 = require('uuid/v4')

class Item
{
    constructor(obj) {
        this._id = undefined
        this.name = undefined
        this.description = undefined
        this.type = undefined // equip.EquipmentType

        this.equippable = false
        this.equipped = false
        this.slot = undefined
        this.wieldable = false  // for weapons
        this.holdable = false   // for tools (torches, etc)

        this.openable = false
        this.inventory = []

        obj && Object.assign(this, obj); // copy constructor
        if (!this._id) {
            this._id = uuid4()
        }
    }

    equip(slot) {
        this.equipped = true
    }
    unequip() {
        this.equipped = false
    }
}

module.exports = Item