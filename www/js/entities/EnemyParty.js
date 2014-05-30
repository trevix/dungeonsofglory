function EnemyParty (_x, _y, _enemies) { //enemies shall be a [];
	var currentPartyFace;
	this.x = _x;
	this.y = _y;

	var enemyPartyPositions = {
		"front-left":"",
		"front-right":"",
		"back-left":"",
		"back-right":"",
	};

	

	this.getCurrentPartyFace = function () {
		return currentPartyFace;
	}
}