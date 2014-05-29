
function Gameplay() {
	//CONST
	var tile_left_up = "#ingame_tile_0_0";
	var tile_left = "#ingame_tile_1_0";
	var tile_left_down = "#ingame_tile_2_0";
	var tile_up = "#ingame_tile_0_1";
	var tile_center = "#ingame_tile_1_1";
	var tile_down = "#ingame_tile_2_1";
	var tile_right_up = "#ingame_tile_0_2";
	var tile_right = "#ingame_tile_1_2";
	var tile_right_down = "#ingame_tile_2_2";

	var new_tile_left_up = "#ingame_tile_0_-1";
	var new_tile_left = "#ingame_tile_2_-1";
	var new_tile_left_down = "#ingame_tile_2_-1";
	var new_tile_up = "#ingame_tile_-1_1";
	var new_tile_center = "#new_ingame_tile_1_1";
	var new_tile_down = "#new_ingame_tile_3_1";
	var new_tile_right_up = "#ingame_tile_0_3";
	var new_tile_right = "#ingame_tile_1_3";
	var new_tile_right_down = "#ingame_tile_2_3";

	//VARS
	var currentObject = this;
	var currentPlayerPositionAtMap = {"x":0, "y":0};
	var currentWorldMap;
	var currentVisibilityMap;

	var mapWidth;
	var mapHeight;
	var miniMapSize;
	var gameMapSize;
	var miniMapTileWidth;
	var miniMapTileHeight;

	var currentPartyPositions = {
		"front-left":"",
		"front-right":"",
		"back-left":"",
		"back-right":""
	};
	//lists
	var currentEnemiesOnMap = [];
	var currentItemsOnMap = [];
	var tilesToRemove = [];

	//controllers
	var currentMapController;


	//I don't even know if I'm gonna use this.
	var baseDivNames = [["tile_left_up", "tile_up", "tile_right_up"],
						["tile_left", "tile_center", "tile_right"],
						["tile_left_dow", "tile_down", "tile_right_down"]];

	var basePositions = [[{"x":TILEWIDTH*1, "y":TILEHEIGHT*0},		{"x":TILEWIDTH*1.5, "y":TILEHEIGHT*0.5},	{"x":TILEWIDTH*2, "y":TILEHEIGHT*1}],
						[ {"x":TILEWIDTH*0.5, "y":TILEHEIGHT*0.5},	{"x":TILEWIDTH, "y":TILEHEIGHT},		{"x":TILEWIDTH*1.5, "y":TILEHEIGHT*1.5}],
						[ {"x":TILEWIDTH*0, "y":TILEHEIGHT},		{"x":TILEWIDTH*0.5, "y":TILEHEIGHT*1.5},{"x":TILEWIDTH, "y":TILEHEIGHT*2}]];
	var currentShowingTiles = [
								[new Tile(0), new Tile(0), new Tile(0)],
								[new Tile(0), new Tile(0), new Tile(0)],
								[new Tile(0), new Tile(0), new Tile(0)] 
								];
	var currentPlayerNextMove = "none";



	this.initialize = function () {
		currentObject.buildScreen();
		currentObject.updateDraw();
	}

	this.buildScreen = function () {
		currentWorldMap = new Map(0);
		currentMapController = new MapController(currentWorldMap);
		mapWidth = currentMapController.getMapWidth();
		mapHeight = currentMapController.getMapWidth();
		currentPlayerPositionAtMap.x = parseInt(mapWidth/2);
		currentPlayerPositionAtMap.y = parseInt(mapWidth/2);
		currentMapController.setMapContent(currentPlayerPositionAtMap.x, currentPlayerPositionAtMap.y, 0);
		main.appendContainer();
		
		currentMapController.resetVisibility();
		currentObject.appendMinimap();
		currentObject.appendIngameMap();
		$("#tilesContainer").touchmove = function (e) {
			e.preventDefault();
		}

		//set z-index
		currentObject.updateZindex();		
		this.setEvents();
		
	}

	this.updateZindex = function () {
		$(tile_left_up).css("z-index", "10" );
		$(tile_left).css("z-index", "11" );
		$(tile_up).css("z-index", "11" );
		$(tile_left_down).css("z-index", "12" );
		$(tile_center).css("z-index", "12" );
		$(tile_right_up).css("z-index", "12" );
		$("#player_center").css("z-index", "13" );
		$(tile_right).css("z-index", "14" );
		$(tile_down).css("z-index", "14" );
		$(tile_right_down).css("z-index", "15" );

		$(new_tile_left_up).css("z-index", "10" );
		$(new_tile_left).css("z-index", "11" );
		$(new_tile_up).css("z-index", "11" );
		$(new_tile_left_down).css("z-index", "12" );
		$(new_tile_right_up).css("z-index", "12" );
		$(new_tile_right).css("z-index", "14" );
		$(new_tile_down).css("z-index", "14" );
		$(new_tile_right_down).css("z-index", "15" );
	}

	this.appendIngameMap = function () {
		gameMapSize = 3;
		$("#container").append("<div id='tilesContainer' class='gameplayContainer'></div>");
		
		$("#tilesContainer").append("<div id='player_center' class='tileContainer noclick'></div>");
		$("#player_center").append( loadedimages[4] ); //debug: just to see the player in the center.
		$("#tilesContainer").css("width", TILEWIDTH*3+"px");
		$("#tilesContainer").css("left", (TILEWIDTH*3/2)-TILEWIDTH+"px");
		for(var i=0; i<gameMapSize; i++){
			for(var j=0; j<gameMapSize; j++){
				$("#tilesContainer").append("<div id='ingame_tile_"+i+"_"+j+"' class='tileContainer noclick'></div>");
				$("#ingame_tile_"+i+"_"+j).css("width", (TILEWIDTH) + "px");
				currentObject.positionTileAt( ("#ingame_tile_"+i+"_"+j+""), i, j);
			}
		}
		currentObject.updateTileContainerContent();
		//debug.
		$("#player_center").css("left", $("#ingame_tile_1_1").css("left") );
		$("#player_center").css("top", $("#ingame_tile_1_1").css("top") );

	}


	this.positionTileAt = function (_objectID, _y, _x) {
		var i = _y;
		var j = _x;
		$(_objectID).css("left", ( (-i*TILEWIDTH/2) + (j*TILEWIDTH/2) ) + "px");
		$(_objectID).css("top", ( (i*TILEHEIGHT/2) + (j*TILEHEIGHT/2) ) + "px" );
	}

	this.updateTileContainerContent = function () {
		$(tile_center).html( currentMapController.receiveTileImageResult( currentPlayerPositionAtMap.x, currentPlayerPositionAtMap.y ) );
		currentMapController.setVisibilityOnMiniMap(currentPlayerPositionAtMap.x, currentPlayerPositionAtMap.y);
		currentObject.repositionTile("_auxPosition");
		$(tile_left).html( currentMapController.receiveTileImageResult( currentPlayerPositionAtMap.x-1, currentPlayerPositionAtMap.y ) );
		currentMapController.setVisibilityOnMiniMap(currentPlayerPositionAtMap.x-1, currentPlayerPositionAtMap.y);
		currentObject.repositionTile("_auxPosition");
		$(tile_left_up).html( currentMapController.receiveTileImageResult( currentPlayerPositionAtMap.x-1, currentPlayerPositionAtMap.y-1 ) );
		currentMapController.setVisibilityOnMiniMap(currentPlayerPositionAtMap.x-1, currentPlayerPositionAtMap.y-1);
		currentObject.repositionTile("_auxPosition");
		$(tile_left_down).html( currentMapController.receiveTileImageResult( currentPlayerPositionAtMap.x-1, currentPlayerPositionAtMap.y+1 ) );
		currentMapController.setVisibilityOnMiniMap(currentPlayerPositionAtMap.x-1, currentPlayerPositionAtMap.y+1);
		currentObject.repositionTile("_auxPosition");
		$(tile_up).html( currentMapController.receiveTileImageResult( currentPlayerPositionAtMap.x, currentPlayerPositionAtMap.y-1 ) );
		currentMapController.setVisibilityOnMiniMap(currentPlayerPositionAtMap.x, currentPlayerPositionAtMap.y-1);
		currentObject.repositionTile("_auxPosition");
		$(tile_right).html( currentMapController.receiveTileImageResult( currentPlayerPositionAtMap.x+1, currentPlayerPositionAtMap.y ) );
		currentMapController.setVisibilityOnMiniMap(currentPlayerPositionAtMap.x+1, currentPlayerPositionAtMap.y);
		currentObject.repositionTile("_auxPosition");
		$(tile_right_up).html( currentMapController.receiveTileImageResult( currentPlayerPositionAtMap.x+1, currentPlayerPositionAtMap.y-1 ) );
		currentMapController.setVisibilityOnMiniMap(currentPlayerPositionAtMap.x+1, currentPlayerPositionAtMap.y-1);
		currentObject.repositionTile("_auxPosition");
		$(tile_right_down).html( currentMapController.receiveTileImageResult( currentPlayerPositionAtMap.x+1, currentPlayerPositionAtMap.y+1 ) );
		currentMapController.setVisibilityOnMiniMap(currentPlayerPositionAtMap.x+1, currentPlayerPositionAtMap.y+1);
		currentObject.repositionTile("_auxPosition");
		$(tile_down).html( currentMapController.receiveTileImageResult( currentPlayerPositionAtMap.x, currentPlayerPositionAtMap.y+1 ) );
		currentMapController.setVisibilityOnMiniMap(currentPlayerPositionAtMap.x, currentPlayerPositionAtMap.y+1);
		currentObject.repositionTile("_auxPosition");
	}

	this.updateDraw = function () {
		currentObject.updateTileContainerContent();
	}

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
				currentObject.updateMiniMap( currentPlayerPositionAtMap.x, currentPlayerPositionAtMap.y );
			}
		}
	}

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
				$("#mp_tile_"+i+"_"+j).css("opacity", currentMapController.MinimapReceiveTileImageResult( j+startX,  i+startY ) );
				if(currentPlayerPositionAtMap.x == j+startX && currentPlayerPositionAtMap.y == i+startY){ //move player indicator to minimap
					$("#mp_hero").css("left", $("#mp_tile_"+i+"_"+j).css("left") );
					$("#mp_hero").css("top", $("#mp_tile_"+i+"_"+j).css("top") );
				}
			}
		}
	}

	this.setEvents = function () {
		$("#tilesContainer").append("<div id='button_up' class='button_container'></div>");
		$("#tilesContainer").append("<div id='button_left' class='button_container'></div>");
		$("#tilesContainer").append("<div id='button_right' class='button_container'></div>");
		$("#tilesContainer").append("<div id='button_down' class='button_container'></div>");
		$("#button_left").html( loadedimages[7].cloneNode(true) );
		$("#button_left").css("left", $(tile_left).css("left") );
		$("#button_left").css("top", $(tile_left).css("top") );
		$("#button_left").css("width", $(tile_center).css("width") );
		$("#button_left").css("height", $(tile_center).css("height") );
		$("#button_right").html( loadedimages[7].cloneNode(true) );
		$("#button_right").css("left", $(tile_right).css("left") );
		$("#button_right").css("top", $(tile_right).css("top") );
		$("#button_right").css("width", $(tile_center).css("width") );
		$("#button_right").css("height", $(tile_center).css("height") );
		$("#button_up").html( loadedimages[7].cloneNode(true) );
		$("#button_up").css("left", $(tile_up).css("left") );
		$("#button_up").css("top", $(tile_up).css("top") );
		$("#button_up").css("width", $(tile_center).css("width") );
		$("#button_up").css("height", $(tile_center).css("height") );
		$("#button_down").html( loadedimages[7].cloneNode(true) );
		$("#button_down").css("left", $(tile_down).css("left") );
		$("#button_down").css("top", $(tile_down).css("top") );
		$("#button_down").css("width", $(tile_center).css("width") );
		$("#button_down").css("height", $(tile_center).css("height") );


		$("#button_left").click( function () {
			currentObject.movePlayer("left");
		} );
		$("#button_right").click( function () {
			currentObject.movePlayer("right");
			
		} );
		$("#button_up").click( function () {
			currentObject.movePlayer("up");
		} );
		$("#button_down").click( function () {
			currentObject.movePlayer("down");
		} );
	}

	this.movePlayer = function (_direction) {
		switch(_direction){
			case "left":
				if(currentPlayerPositionAtMap.x > 0){
					switch(currentMapController.checkPositionContent(currentPlayerPositionAtMap.x-1, currentPlayerPositionAtMap.y))
					{
						case "floor":
							currentPlayerNextMove = "left";
							currentPlayerPositionAtMap.x -= 1;	
						break;
					}
				}
			break;
			case "right":
				if(currentPlayerPositionAtMap.x < mapWidth){
					switch(currentMapController.checkPositionContent(currentPlayerPositionAtMap.x+1, currentPlayerPositionAtMap.y))
					{
						case "floor":
							currentPlayerNextMove = "right";
							currentPlayerPositionAtMap.x += 1;	
						break;
					}
				}
			break;
			case "up":
			if(currentPlayerPositionAtMap.y > 0){
				switch( currentMapController.checkPositionContent(currentPlayerPositionAtMap.x, currentPlayerPositionAtMap.y-1) )
				{
					case "floor":
						currentPlayerNextMove = "up";
						currentPlayerPositionAtMap.y -= 1;
					break;
				}
			}
			break;
			case "down":
			if(currentPlayerPositionAtMap.y < mapHeight){
				switch(currentMapController.checkPositionContent(currentPlayerPositionAtMap.x, currentPlayerPositionAtMap.y+1))
				{
					case "floor":
						currentPlayerNextMove = "down";
						currentPlayerPositionAtMap.y += 1;
					break;
				}
			}
			break;
		}
		currentObject.step();
		
	}

	this.loadSavedData = function () {

	}

	this.step = function () {
		currentObject.playerStep();
		currentObject.enemyStep();
		currentObject.updateDraw();
		currentObject.updateMiniMap(currentPlayerPositionAtMap.x, currentPlayerPositionAtMap.y);
	}

	this.playerStep = function () {		
	}

	this.enemyStep = function () {

	}

	this.repositionTile = function (_id) {
		var returnImage = $("#"+_id);
		if(returnImage != null || returnImage != undefined){

			var returnImageHeight = returnImage.css("height").replace("px","");

			if( returnImageHeight > TILEHEIGHT ){
				var heightDiff = TILEHEIGHT - returnImageHeight;
				returnImage.css("transform", "translateY("+heightDiff+"px)");
				returnImage.css("-webkit-transform", "translateY("+heightDiff+"px)");
				returnImage.css("-ms-transform", "translateY("+heightDiff+"px)");
			}
			returnImage.attr("id", "_useless");
		}
	}

}
