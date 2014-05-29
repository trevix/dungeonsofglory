function MapController (_mapGrid) {
	//constructor stuff

	var currentObject = this;

	var currentWorldMap;
	var currentVisibilityMap;
	currentWorldMap = _mapGrid;

	if(currentWorldMap == null || currentWorldMap == undefined)
	{
		currentWorldMap = [[0,0,0],
						  [0,0,0],
						  [0,0,0]];
	}
	//////////////


	this.getMapContent = function (_x, _y) {
		return currentWorldMap[_x][_y];
	}

	this.updateCurrentWorldMap = function (_newMap) {
		currentWorldMap = _newMap;
	}


	// minimap visibility

	this.setVisibilityOnMiniMap = function (_x, _y) {
		currentVisibilityMap[_y][_x] = 1;
	}
	
	this.resetVisibility = function () {
		currentVisibilityMap = [];
		for(var i = 0; i<currentWorldMap.length; i++){
			currentVisibilityMap[i] = [];
			for(var j = 0; j<currentWorldMap[i].length; j++){
				currentVisibilityMap[i][j] = 0;
			}
		}
	}

	this.receiveTileImageResult = function (_x, _y) {
		var returnImage;

		var mapTileValue = currentObject.getMapContent(_x, _y);

		switch(mapTileValue){
			case 0:
				returnImage = loadedimages[0].cloneNode(true);
			break;
			case 1:
				returnImage = loadedimages[1].cloneNode(true);
			break;
			case 2:
				returnImage = loadedimages[2].cloneNode(true);
			break;
			case 3:
				returnImage = loadedimages[3].cloneNode(true);
			break;
			default:
				returnImage = loadedimages[0].cloneNode(true);
			break;
		}

		returnImage.id = "_auxPosition";
		return returnImage;
	}

	this.checkPositionContent = function (_targetX, _targetY) {
		//check if it's walkable
		switch ( currentWorldMap[ _targetX ][ _targetY ] ) {
			case 0:
			case 3:
				return "floor";
			break;
			case 1:
			case 2:
				return "wall";
			break;
		}
		
	}

	this.MinimapReceiveTileImageResult = function (_x, _y) {
		var currentTileContent = currentObject.checkPositionContent(_x, _y);
		var returnValue;

		switch(currentTileContent){
			case "wall":
				returnValue = 0.2;
			break;
			case "floor":
				returnValue = 0.75;
			break;
			default:
				returnValue = 0.75;
			break;
		}

		if(currentVisibilityMap[_y][_x] == 0){
			returnValue = 0;
		}

		return returnValue;
	}
}