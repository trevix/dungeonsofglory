
function Enemy(_enemyType) {

	this.spriteSheet; //this should contain all enemy frames.
	this.maxHP; // max HP. (used for starting hp and when the unity is healed)
	this.maxMP; //max MP. 
	this.regenMP; //value it regens MP when not attacking;
	this.attackValue; //base attack value;
	this.attackType; //hit grid 3x3;
	this.defenseValue; //base defense value;
	this.elementType; // enemy element.
	this.currentLootPool; //items and chance of dropping
	this.turnValue; //1 steps every turn, 2 steps every two turns and so on.
	
	
	
	this.currentShowingSprite; //current sprite. I still need to think of how I will handle animations. leave me alone.
	this.currentHP; //
	this.currentMP; //
	this.gridLocation; // 0,0 to 1,1 (on a 2x2 grid); enemy party controls this.


	if(_enemyType == null || _enemyType == undefined){
		_enemyType = 0;
	}

}
