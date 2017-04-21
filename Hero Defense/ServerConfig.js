var config = {
	include: [
		{name: 'ServerNetworkEvents', path: './gameClasses/ServerNetworkEvents'},
		{name: 'Ability', path: './Abilities/Ability'},
		{name: 'JumpingMoveAbility', path: './Abilities/JumpingMoveAbility'},
		{name: 'Character', path: './Actors/Character'},
		{name: 'CharacterDef', path: './CharacterDefs/CharacterDef'},
		{name: 'MonsterDefList', path: './CharacterDefs/MonsterDefList'},
		{name: 'PlayerDef', path: './CharacterDefs/PlayerDef'},
		{name: 'WorldSettings', path: './World/WorldSettings'},
		{name: 'PlayerComponent', path: './Actors/Components/PlayerComponent'},
		{name: 'MonsterComponent', path: './Actors/Components/MonsterComponent'},
		{name: 'MonsterComponentAcorn', path: './Actors/Components/MonsterComponentAcorn'},
		{name: 'CharacterFactory', path: './Actors/CharacterFactory'},
		{name: 'MonsterDirector', path: './Actors/Monsters/MonsterDirector'},
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = config; }
