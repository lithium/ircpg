

var EquipmentTypes = {
    Helmet: "helmet",
    Cape: "cape",
    Armor: "armor",
    Shield: "shield",
    Belt: "belt",
    Gloves: "gloves",
    Boots: "boots",
    Accessory: "accessory",
    Weapon: "weapon",
    Tool: "tool",
};
Object.freeze(EquipmentTypes)


var ValidEquipmentSlots = {
    "Helmet": [EquipmentTypes.Helmet],
    "Cape": [EquipmentTypes.Cape],
    "Armor": [EquipmentTypes.Armor],
    "Shield": [EquipmentTypes.Shield],
    "Belt": [EquipmentTypes.Belt],
    "Gloves": [EquipmentTypes.Gloves],
    "Boots": [EquipmentTypes.Boots],
    "Accessory1": [EquipmentTypes.Accessory],
    "Accessory2": [EquipmentTypes.Accessory],
    "PrimaryWeapon": [EquipmentTypes.Weapon, EquipmentTypes.Tool],
    "OffhandWeapon": [EquipmentTypes.Weapon, EquipmentTypes.Tool],
};



class EquipmentSlots {
    constructor(obj) {
        Object.keys(ValidEquipmentSlots).forEach(slot => this[slot] = undefined)
        Object.seal(this)
        obj && Object.assign(this, obj); // copy constructor
    }

    equip(slot, item) {
        var typesForSlot = ValidEquipmentSlots[slot] 
        if (item.equippable && typesForSlot && typesForSlot.indexOf(item.type) != -1)
        {
            this.unequip(slot)
            this[slot] = item
            item.equip(slot)
            return true
        }
        return false
    }

    unequip(slot) {
        if (this[slot]) {
            this[slot].unequip()
            delete this[slot];
        }
    }
}


class Inventory {
    constructor(obj) {
        this.items = []
        this.maxSize = 99
        Object.seal(this)

        obj && Object.assign(this, obj); // copy constructor
    }

    addItem(item) {
        if (this.items.length < maxSize) {
            this.items.push(item) 
            return true
        }
        return false
    }
    removeItem(item) {
        var existingIndex = this.items.findIndex(_ => _._id == item._id)
        if (existingIndex) {
            this.items.splice(existingIndex, 1)
            return true;
        }
        return false
    }
}

module.exports = {
    EquipmentTypes: EquipmentTypes,
    ValidEquipmentSlots: ValidEquipmentSlots,
    EquipmentSlots: EquipmentSlots,
    Inventory: Inventory
}