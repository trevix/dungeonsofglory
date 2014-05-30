
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

	var monster_tile_left_up = "#monster_ingame_tile_0_0";
	var monster_tile_left = "#monster_ingame_tile_1_0";
	var monster_tile_left_down = "#monster_ingame_tile_2_0";
	var monster_tile_up = "#monster_ingame_tile_0_1";
	var monster_tile_center = "#monster_ingame_tile_1_1";
	var monster_tile_down = "#monster_ingame_tile_2_1";
	var monster_tile_right_up = "#monster_ingame_tile_0_2";
	var monster_tile_right = "#monster_ingame_tile_1_2";
	var monster_tile_right_down = "#monster_ingame_tile_2_2";

	var item_tile_left_up = "#item_ingame_tile_0_0";
	var item_tile_left = "#item_ingame_tile_1_0";
	var item_tile_left_down = "#item_ingame_tile_2_0";
	var item_tile_up = "#item_ingame_tile_0_1";
	var item_tile_center = "#item_ingame_tile_1_1";
	var item_tile_down = "#item_ingame_tile_2_1";
	var item_tile_right_up = "#item_ingame_tile_0_2";
	var item_tile_right = "#item_ingame_tile_1_2";
	var item_tile_right_down = "#item_ingame_tile_2_2";

	//VARS
	var currentObject = this;
	var currentPlayerPositionAtMap = {"x":0, "y":0};
	this.currentPlayerPositionAtMap = function () { return currentPlayerPositionAtMap; } ;
	var currentWorldMap;
	this.currentWorldMap = function () { return currentWorldMap; } ;

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
	var currentItemList = [];
	var tilesToRemove = [];

	//controllers
	var currentMapController;
	var currentEnemyController;
	var currentItemController;


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
		console.log(currentWorldMap);
		currentMapController = new MapController( currentObject );
		currentEnemyController = new EnemyController( currentObject );
		currentItemController = new ItemController( currentObject );

		mapWidth = currentMapController.getMapWidth();
		mapHeight = currentMapController.getMapWidth();
		currentPlayerPositionAtMap.x = parseInt(mapWidth/2);
		currentPlayerPositionAtMap.y = parseInt(mapWidth/2);
		currentMapController.setMapContent(currentPlayerPositionAtMap.x, currentPlayerPositionAtMap.y, 0);
		main.appendContainer();
		
		currentMapController.appendMinimap();
		currentMapController.resetVisibility();
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

		$(monster_tile_left_up).css("z-index", "11" );
		$(monster_tile_left).css("z-index", "12" );
		$(monster_tile_up).css("z-index", "12" );
		$(monster_tile_left_down).css("z-index", "13" );
		$(monster_tile_right_up).css("z-index", "13" );
		$(monster_tile_center).css("z-index", "13" );
		$(monster_tile_right).css("z-index", "15" );
		$(monster_tile_down).css("z-index", "15" );
		$(monster_tile_right_down).css("z-index", "16" );

		$(item_tile_left_up).css("z-index", "11" );
		$(item_tile_left).css("z-index", "12" );
		$(item_tile_up).css("z-index", "12" );
		$(item_tile_left_down).css("z-index", "13" );
		$(item_tile_right_up).css("z-index", "13" );
		$(item_tile_center).css("z-index", "13" );
		$(item_tile_right).css("z-index", "15" );
		$(item_tile_down).css("z-index", "15" );
		$(item_tile_right_down).css("z-index", "16" );
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
				$("#tilesContainer").append("<div id='monster_ingame_tile_"+i+"_"+j+"' class='tileContainer noclick'></div>");
				$("#monster_ingame_tile_"+i+"_"+j).css("width", (TILEWIDTH) + "px");
				$("#tilesContainer").append("<div id='item_ingame_tile_"+i+"_"+j+"' class='tileContainer noclick'></div>");
				$("#item_ingame_tile_"+i+"_"+j).css("width", (TILEWIDTH) + "px");
				currentObject.positionTileAt( ("#ingame_tile_"+i+"_"+j+""), i, j);
				currentObject.positionTileAt( ("#monster_ingame_tile_"+i+"_"+j+""), i, j);
				currentObject.positionTileAt( ("#item_ingame_tile_"+i+"_"+j+""), i, j);
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

		$(monster_tile_center).html( currentEnemyController.getEnemyAtPosition( currentPlayerPositionAtMap.x, currentPlayerPositionAtMap.y ) );
		$(monster_tile_left).html( currentEnemyController.getEnemyAtPosition( currentPlayerPositionAtMap.x-1, currentPlayerPositionAtMap.y ) );
		$(monster_tile_left_down).html( currentEnemyController.getEnemyAtPosition( currentPlayerPositionAtMap.x-1, currentPlayerPositionAtMap.y+1 ) );
		$(monster_tile_left_up).html( currentEnemyController.getEnemyAtPosition( currentPlayerPositionAtMap.x-1, currentPlayerPositionAtMap.y-1 ) );
		$(monster_tile_up).html( currentEnemyController.getEnemyAtPosition( currentPlayerPositionAtMap.x, currentPlayerPositionAtMap.y-1 ) );
		$(monster_tile_right).html( currentEnemyController.getEnemyAtPosition( currentPlayerPositionAtMap.x+1, currentPlayerPositionAtMap.y ) );
		$(monster_tile_right_up).html( currentEnemyController.getEnemyAtPosition( currentPlayerPositionAtMap.x+1, currentPlayerPositionAtMap.y-1 ) );
		$(monster_tile_right_down).html( currentEnemyController.getEnemyAtPosition( currentPlayerPositionAtMap.x+1, currentPlayerPositionAtMap.y+1 ) );
		$(monster_tile_down).html( currentEnemyController.getEnemyAtPosition( currentPlayerPositionAtMap.x, currentPlayerPositionAtMap.y+1 ) );

		$(item_tile_center).html( currentItemController.getItemAtPosition( currentPlayerPositionAtMap.x, currentPlayerPositionAtMap.y ) );
		$(item_tile_left).html( currentItemController.getItemAtPosition( currentPlayerPositionAtMap.x-1, currentPlayerPositionAtMap.y ) );
		$(item_tile_left_down).html( currentItemController.getItemAtPosition( currentPlayerPositionAtMap.x-1, currentPlayerPositionAtMap.y+1 ) );
		$(item_tile_left_up).html( currentItemController.getItemAtPosition( currentPlayerPositionAtMap.x-1, currentPlayerPositionAtMap.y-1 ) );
		$(item_tile_up).html( currentItemController.getItemAtPosition( currentPlayerPositionAtMap.x, currentPlayerPositionAtMap.y-1 ) );
		$(item_tile_right).html( currentItemController.getItemAtPosition( currentPlayerPositionAtMap.x+1, currentPlayerPositionAtMap.y ) );
		$(item_tile_right_up).html( currentItemController.getItemAtPosition( currentPlayerPositionAtMap.x+1, currentPlayerPositionAtMap.y-1 ) );
		$(item_tile_right_down).html( currentItemController.getItemAtPosition( currentPlayerPositionAtMap.x+1, currentPlayerPositionAtMap.y+1 ) );
		$(item_tile_down).html( currentItemController.getItemAtPosition( currentPlayerPositionAtMap.x, currentPlayerPositionAtMap.y+1 ) );
	}

	this.updateDraw = function () {
		currentObject.updateTileContainerContent();
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
		currentMapController.updateMiniMap(currentPlayerPositionAtMap.x, currentPlayerPositionAtMap.y);
		currentObject.updateDraw();
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
