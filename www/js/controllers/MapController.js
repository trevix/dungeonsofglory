function MapController (_mapGrid) {
	var currentWorldMap;
	currentWorldMap = _mapGrid;
	if(currentWorldMap == null || currentWorldMap == undefined)
	{
		currentWorldMap = [[0,0,0],
						  [0,0,0],
						  [0,0,0]];
	}

	this.receiveTileImageResult = function (_x, _y) {
		var returnImage;
		var mapTileValue = currentWorldMap[_x][_y];

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

	this.updateCurrentWorldMap = function (_newMap) {
		currentWorldMap = _newMap;
	}
}