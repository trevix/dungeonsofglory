function ItemController (_currentGameplay) {
	var currentGameplay = _currentGameplay;
	var currentItemList = currentGameplay.currentItemList;
	currentItemList = [ new Item(16,13), new Item(16,15), new Item(1,2) ];

	this.getItemAtPosition = function (_x, _y) {
		var returnValue = "";
		for(var i = 0; i<currentItemList.length; i++){
			if(currentItemList[i].x == _x && currentItemList[i].y == _y){
				returnValue = loadedimages[10].cloneNode(true);
			}

		}
		return returnValue;
	}
}