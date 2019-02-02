
const equip = require('../item/equip')


class Mob {

    constructor(obj) {
        this.hp = undefined
        this.maxHp = undefined
        this.equipment = new equip.EquipmentInventory()
        this.inventory = new equip.Inventory()


        obj && Object.assign(this, obj) // copy construtor
    }

}


module.exports = Mob