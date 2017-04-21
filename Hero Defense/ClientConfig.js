var igeClientConfig = {
	include: [
		/* Your custom game JS scripts */
		'./gameClasses/ClientNetworkEvents.js',
		'./CharacterDefs/CharacterDef.js',
		'./CharacterDefs/PlayerDef.js',
		'./CharacterDefs/MonsterDefList.js',
		'./Abilities/Ability.js',
		'./Abilities/JumpingMoveAbility.js',
		'./Actors/Character.js',
		'./Actors/Components/PlayerComponent.js',
		'./Actors/Components/MonsterComponent.js',
		'./Actors/Components/MonsterComponentAcorn.js',
		'./Actors/Monsters/MonsterDirector.js',
		'./Actors/CharacterFactory.js',
		'./World/WorldSettings.js',
		/* Standard game scripts */
		'./client.js',
		'./index.js'
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeClientConfig; }
