
const equip = require('../item/equip')


class Mob {

    constructor(obj) {
        this._name = undefined
        this.mobType = undefined
        this.hp = undefined
        this.maxHp = undefined
        this.equipment = new equip.EquipmentInventory()
        this.inventory = new equip.Inventory()


        obj && Object.assign(this, obj) // copy construtor
    }

    get name() {
        if (this._name) {
            return this._name
        }
        if (this.nick) {
            return this.nick
        }
        if (this.mobType) {
            return `a ${this.mobType}`
        }
        return 'Mob'
    }
    set name(newName) {
        this._name = newName
    }

}


module.exports = Mob