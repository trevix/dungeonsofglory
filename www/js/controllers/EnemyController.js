function EnemyController (_currentGameplay) {
	var currentGameplay = _currentGameplay;
	var currentEnemyList = currentGameplay.currentEnemyList;
	currentEnemyList = [ new EnemyParty(15,14), new EnemyParty(18,12), new EnemyParty(10,8) ];

	this.getEnemyAtPosition = function (_x, _y) {
		var returnValue = "";
		for(var i = 0; i<currentEnemyList.length; i++){
			console.log( currentEnemyList[i] );
			if(currentEnemyList[i].x == _x && currentEnemyList[i].y == _y){
				returnValue = loadedimages[9].cloneNode(true);
			}

		}
		return returnValue;
	}
}