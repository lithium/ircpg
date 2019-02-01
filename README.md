IRCPG
-----

IRC bot that provides a persistent world MUD/MUSH


Playing
=======
Character name is your current nick. You can only act as a character with the same name as your current nick. You can register and password protect unclaimed nicks for new Characters.

A Character can be in any number of Rooms(channels) at the same time. Public actions only apply to the channel they are used in. But the character has the same equipment, status, hp etc in all. (a Character in one Room may appear to suddenly fall dead because they were being attacked in another channel)


CHANNELS
========
An op of a channel can invite Dmbot to it.  Any channel Dmbot is in has an associated Area with at least 1 Room. Any registered Characters in that channel are considered part of the same Group and are all in the same Current Room.  Any Character may issue a GO command to change the Current Room. If some of the Characters in the channel are unable to use that exit, all Characters stay in the original room.


AREAS
=====
An Area is a collection of Rooms connected by Exits.  An Exit may have an obstacle that will require a skill check to successfully traverse it.  Rooms can be populated with Items or Mobs.  Mobs and Items can be spawned from Blueprints based on Character Level


DUNGEONS
========
Characters can request a randomized dungeon instance. Dmbot will generate a randomized Area and a new private channel for the Character and invite the Character and op them. 


COMBAT
======
Dmbot ticks every Heartbeat, Actions submitted before the Heartbeat will be resolved on the next Heartbeat. Characters can attack any mob or player in the same Room. 


CHARACTERS
==========
Characters can gain Class Levels by choosing an active class and gaining enough xp to level up.

### Level

Character Level is determined by the sum of all Class Levels.  
A Character can only have 1 Active Class at any time. 
XP gained goes towards your next Active Class Level.  
If you switch your Active Class, your XP will be retained until when you switch back to that class. 

### CLASSES

Characters start out with Commoner as the Active Class. Commoners have only Simple Weapon Proficiency and no Armor Proficiencies.

### ACTIONS

*Public Actions*

Public Actions are used with IRC /action in the channel you want to act in: `/me go north`

 * go/goes &lt;direction> 
 * attack/attacks &lt;target>
 * cast/casts &lt;spell> [targets]
 * use/uses &lt;item>
 * search/searches [target]
 * pickup/"picks up" &lt;item>
 * drop/drops &lt;item>
 * look/looks [target]

*Private Commands*

Private Commands are sent in private message to Dmbot:  `/msg DM equip`

 * EQUIP &lt;item> [slot]
 * UNEQUIP &lt;slot>
 * STATUS 
 * CLASS
 * INVENTORY [filter]


### SKILLS

 - Athletics (climbing, jumping, swimming)
 - Acrobatics (balancing, dodging, rolling)
 - Stealth (avoid Mobs)
 - Arcana (know about magic items)
 - Investigation (find nearby hidden items/traps)
 - Medicine (cure diseases, poisons)
 - Perception (spot faraway mobs/items)

### PROFICIENCIES 

 - Light Armor (equip armor [higher level items require more skill?])
 - Medium Armor
 - Heavy Armor
 - Shields
 - Simple Melee/Ranged
 - Martial Melee/Ranged

### EQUIPMENT

 - helmet
 - cape
 - armor
 - shield
 - belt
 - gloves
 - boots
 - 2 accessory (ring,necklace,bracelet)
