function MapController (_gameplay) {
	//constructor stuff
	var currentGameplay = _gameplay;
	var currentObject = this;

	var currentWorldMap;
	var currentVisibilityMap;
	

	var miniMapSize;

	var mapWidth;
	var mapHeight;

	currentWorldMap = currentGameplay.currentWorldMap();
	mapWidth = currentWorldMap.length;
	mapHeight = currentWorldMap[0].length;

	if(currentWorldMap == null || currentWorldMap == undefined)
	{
		currentWorldMap = [];
	}
	//////////////

	this.getMapContent = function (_x, _y) {
		return currentWorldMap[_x][_y];
	}

	this.setMapContent = function (_x, _y, _value) {
		currentWorldMap[_x][_y] = _value;
	}

	this.updateCurrentWorldMap = function (_newMap) {
		currentWorldMap = _newMap;
	}

	this.getMapWidth = function () {
		return currentWorldMap.length;
	}

	//minimap stuff

	this.appendMinimap = function () {
		$("#container").append("<div id='minimapContainer' class='minimapContainer'></div>");
		miniMapSize = 9;
		if(miniMapSize > mapWidth){
			miniMapSize = mapWidth;
		}
		miniMapTileWidth = TILEWIDTH/10;
		miniMapTileHeight = TILEHEIGHT/10;
		
		$("#minimapContainer").append("<div id='mp_hero' class='minimapTileContainer minimapHero'></div>");
		$("#mp_hero").html( loadedimages[8] );
		$("#mp_hero").css("width", (miniMapTileWidth) + "px");
		for(var i=0; i<miniMapSize; i++){
			for(var j=0; j<miniMapSize; j++){
				$("#minimapContainer").append("<div id='mp_tile_"+i+"_"+j+"' class='minimapTileContainer'></div>");
				$("#mp_tile_"+i+"_"+j).css("width", (miniMapTileWidth) + "px");
				$("#mp_tile_"+i+"_"+j).css("left", ( (-i*miniMapTileWidth/2) + (j*miniMapTileWidth/2) ) + "px");
				$("#mp_tile_"+i+"_"+j).css("top", ( (i*miniMapTileHeight/2) + (j*miniMapTileHeight/2) ) + "px" );
				$("#mp_tile_"+i+"_"+j).html( loadedimages[6].cloneNode(true) );
			}
		}
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

	// minimap update
	this.updateMiniMap = function (_centerX, _centerY) {
		var maxLimitX = (mapWidth - parseInt(miniMapSize/2));
		var maxLimitY = (mapHeight - parseInt(miniMapSize/2));
		var minLimitX = parseInt(miniMapSize/2)+1;
		var minLimitY = parseInt(miniMapSize/2)+1;


		if( _centerX  > maxLimitX ){ //restrains minimap center position.
			_centerX = maxLimitX;
		}
		if( _centerX < minLimitX){
			_centerX = minLimitX;
		}
		if( _centerY  > maxLimitY ){
			_centerY = maxLimitY;
		}
		if( _centerY < minLimitY){
			_centerY = minLimitY;
		}

		var startX = _centerX -  Math.round( miniMapSize/2 );
		var startY = _centerY -  Math.round( miniMapSize/2 );		

		for(var i=0; i<miniMapSize; i++){
			for(var j=0; j<miniMapSize; j++){
				$("#mp_tile_"+i+"_"+j).css("opacity", currentObject.MinimapReceiveTileImageResult( j+startX,  i+startY ) );
				if(currentGameplay.currentPlayerPositionAtMap().x == j+startX && currentGameplay.currentPlayerPositionAtMap().y == i+startY){ //move player indicator to minimap
					$("#mp_hero").css("left", $("#mp_tile_"+i+"_"+j).css("left") );
					$("#mp_hero").css("top", $("#mp_tile_"+i+"_"+j).css("top") );
				}
			}
		}
	}
	//

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