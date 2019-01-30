# User Stories

## Characters

    - users can register nicks
    - characters have a permanent state
    - characters can set their prefix 
    - characters have an active channel (last channel dmbot saw them join or they can GO #channel)
    - characters have an inventory
    - characters can equip equipment
    - basic character actions ```
        GO to a new room (n,e,s,w,u,d)
        ATTACK a target
        CAST a spell
        DODGE to increase defense
        HIDE 
        WEAR a piece of equipment
        WIELD a weapon
        HOLD an item
        USE an item
        SEARCH the immediate room
        CLASS choose active class
        GET an item
        DROP an item
        EQUIPMENT list equipment
        INVENTORY list inventory
        LOOK at the room```


## Items

    - items can be instantiated from a Template

   
## Rooms

    - each channel has an active Room
    - rooms have any number of exits that connect to other Rooms
    - exits can have obstacles that require skill checks 
    - rooms can contain Items
    - rooms can be instantiated from a Template

## Mobs

    - mobs can behave exactly like Characters
    - mobs can be instantiated from a Template
    - mob behavior is defined by es6 scripts that are sandboxed

