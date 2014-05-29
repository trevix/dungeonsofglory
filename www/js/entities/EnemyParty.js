function EnemyParty (_frontLeftEnemy, _frontRightEnemy, _backLeftEnemy, _backRightEnemy) {
	
	var enemyPartyPositions = {
		"front-left":"",
		"front-right":"",
		"back-left":"",
		"back-right":"",
	};

	var currentPartyFace;

	this.getCurrentPartyFace = function () {
		return currentPartyFace;
	}
}