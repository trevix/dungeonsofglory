function Map (_level) {
	var currentObject = this;

	if(_level == null || _level == undefined) {
		_level = 0;
	}

	var currentMapLevel = _level;
	var mapGrid;


	var targetMapSize;
	var targetNumCorridors;
	var targetCorridorMinSize;
	var targetCorridorRandomSize;
	var targetRoomMinSize;
	var targetRoomRandomSize;
	var targetNumRooms;
	var targetCorridorStraightness;
	var targetCorridorNumNodes;
	var targetCorridorRandomNodes;

	this.generateMap = function () {
		mapGrid = [];
		switch( currentMapLevel ) {
			case 0:
				targetMapSize = 30;
				targetNumCorridors = 15;
				targetCorridorMinSize = 10;
				targetCorridorRandomSize = 30;
				targetRoomMinSize = 1;
				targetRoomRandomSize = 3;
				targetNumRooms = 3;
				targetCorridorStraightness = 10;
				targetCorridorNumNodes = 3;
				targetCorridorRandomNodes = 5;
			break;
		}
		currentObject.createGrid(targetMapSize);
		currentObject.generateWalls();
		currentObject.generateCorridors();
		currentObject.changeGroundTiles();
	}

	this.createGrid = function (_size) {

		mapGrid = [];
		for(var i= 0; i<_size; i++) {
			mapGrid[i] = [];
			for (var j = 0; j<_size; j++) {
				mapGrid[i][j] = 0;
				if(j == 0 || j==_size-1 || i == 0 || i ==_size-1){
					mapGrid[i][j] = 2;
				}
			}
		}
	}

	this.generateWalls = function () {
		for(var i= 0; i<mapGrid.length; i++) {
			for (var j = 0; j<mapGrid[0].length; j++) {
					if(mapGrid[i][j] != 2)
					{
						mapGrid[i][j] = 1;	
					}
				}
			}
	}

	this.generateCorridors = function () {
		var corridorList = [];
		var currentX = Math.round(mapGrid.length/2);
		var currentY = Math.round(mapGrid.length/2);
		var currentDirection = currentObject.getRandomDirection();
		var currentLenght = Math.round(targetCorridorMinSize + Math.random()*targetCorridorRandomSize);
		var lastDirection = "none";
		var currentNumNodes = Math.round(targetCorridorNumNodes + Math.random()*targetCorridorRandomNodes);
		var difX;
		var difY;
		var currentKindex;
		var currentJindex;
		for(var k = 0; k<targetNumCorridors; k++){
			currentX = Math.round(mapGrid.length/2);
			currentY = Math.round(mapGrid.length/2);
			currentDirection = currentObject.getRandomDirection();
			currentLenght = Math.round(targetCorridorMinSize + Math.random()*targetCorridorRandomSize);
			currentNumNodes = Math.round(targetCorridorNumNodes + Math.random()*targetCorridorRandomNodes)
			lastDirection = "none";
			currentKindex = corridorList.length;
			corridorList[currentKindex] = { "corridors":[] };
			for(var j = 0; j<currentNumNodes; j++){
				currentJindex = corridorList[currentKindex].corridors.length;
				corridorList[currentKindex].corridors[ currentJindex ] = new Corridor(currentX, currentY, currentLenght, currentDirection);
				lastDirection = currentDirection;
				switch(currentDirection){
					case "left":
						difX = -currentLenght;
					break;
					case "right":
						difX = currentLenght;
					break;
					case "up":
						difY = -currentLenght;
					break;
					case "down":
						difY = currentLenght;
					break;
				}
				currentX = Math.round(currentX + difX);
				currentY = Math.round(currentY + difY);
				currentDirection = currentObject.getRandomDirection();
				console.log(currentDirection + "/" + lastDirection);
				
				currentLenght = Math.round(targetCorridorMinSize + Math.random()*targetCorridorRandomSize);
			}

		}

		for(var k = 0; k<corridorList.length; k++){
				for(var j = 0; j<corridorList[k].corridors.length; j++){
					currentObject.drillCorridor(corridorList[k].corridors[j].x, corridorList[k].corridors[j].x,
						corridorList[k].corridors[j].length, corridorList[k].corridors[j].direction );
				}
			}

	}

	this.drillRoom = function (_startX, _startY, _width, _height) {
		//todo
	}

	this.drillCorridor = function (_startX, _startY, _length, _direction) {
		console.log( arguments );
		_length = Math.round(_length);
		var corridorX = _startX;
		var corridorY = _startY;

		var corridorDirection = _direction;

		for(var i =0; i< _length; i++ ){
			if(corridorY >= mapGrid.length){
				corridorY = mapGrid.length-1;
			}
			if(corridorY < 0) {
				corridorY = 1;
			}
			if(corridorX >= mapGrid[0].length){
				corridorX = mapGrid[0].length-1;
			}
			if(corridorX < 0) {
				corridorX = 1;
			}

			switch(corridorDirection){
				case "left":
					if(corridorX < mapGrid[0].length){
						corridorX += 1;
					}
				break;
				case "right":
					if(corridorX > 0){
						corridorX -= 1;
					}
				break;
				case "up":
					if(corridorY < mapGrid.length){
						corridorY += 1;
					}
				break;
				case "down":
					if(corridorY > 0){
						corridorY -= 1;
					}
				break;
			}
			
			//if able to drill hole
			if(mapGrid[corridorY] != undefined && mapGrid[corridorY][corridorX] != undefined){
				if(mapGrid[corridorY][corridorX] != 2){
					mapGrid[corridorY][corridorX] = 0;
				}
			}
		}

	}

	this.getRandomDirection = function () {
		var _direction;

		switch( Math.floor(Math.random()*4 ) ) {
				case 0:
				_direction = "down";
				break;
				case 1:
				_direction = "right";
				break;
				case 2:
				_direction = "left";
				break;
				case 3:
				_direction = "up";
				break;
			}
		return _direction
	}

	this.checkVerticesContent = function (_targetX, _targetY) {
		//check if it's walkable
		if(mapGrid[ _targetX ] == undefined || mapGrid[ _targetX ][ _targetY ] == undefined){
			return "floor";
		}
		var numFreeSpaces = 0;
		for(var i = 0; i< 4; i++){
			for(var j = 0; j<4; j++) {
				if(mapGrid[ _targetX +(i-1)] != undefined && mapGrid[ _targetX +(i-1)][ _targetY+(j-1) ] != undefined){
					switch ( mapGrid[ _targetX+(i-1) ][ _targetY+(j-1) ] ) {
						case 0:
						case 3:
							numFreeSpaces++;
						break;
					}
				}
			}
		}
		if(numFreeSpaces <2){
			return "wall"
		} else {
			return "floor";
		}
	}

	this.generateRoom = function (_x, _y, _width, _height, _direction) {
		if(_direction == null || _direction == undefined){
			_direction = "right";
		}
		var i;
		var j;
		for(i = 0; i<_height; i++){
			if((_y+i) < mapGrid.length-1){
				for(j = 0; j<_width; j++){
					if((_x+j) < mapGrid[0].length-1){
						mapGrid[_y+i][_x+j] = 0;
					}
				}
			}
		}

		if(targetNumCorridors > 0){
			currentObject.generateCorridor( _x+j-1, _y+i-1,
			targetCorridorMinSize + Math.random()*targetCorridorRandomSize,
			"random"
			);

		}
	}

	this.changeDirection = function (chance, _corridorDirection) {
		if(chance == "changeDirection"){
			return currentObject.getRandomDirection();
		}

		var lastDirection = _corridorDirection;
		var newDirection = _corridorDirection;
		if(chance > 0.5){
				newDirection = currentObject.getRandomDirection();
			}
			if(newDirection != lastDirection){
				return newDirection;
			} else {
				currentObject.changeDirection(0.6, lastDirection );
			}
		
	}

	this.changeGroundTiles = function () {
		for(var i= 0; i<mapGrid.length; i++) {
			for (var j = 0; j<mapGrid[0].length; j++) {
				if(mapGrid[i][j] == 0) {
					if( (i+j)%2 == 0 ){
						mapGrid[i][j] = 0;
					} else {
						mapGrid[i][j] = 3;
					}
				}
				
			}
		}	
	}


	currentObject.generateMap();
	return mapGrid;

}