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

	this.generateMap = function () {
		mapGrid = [];
		console.log("generate map");
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
			break;
			case 1:
				targetMapSize = 35;
				targetNumCorridors = 2;
				targetCorridorMinSize = 40;
				targetCorridorRandomSize = 20;
				targetRoomMinSize = 2;
				targetRoomRandomSize = 2;
				targetNumRooms = 3;
				targetCorridorStraightness = 4;
			break;
		}
		currentObject.createGrid(targetMapSize);
		currentObject.generateWalls();
		currentObject.drillCorridors();
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

	this.drillCorridors = function () {
		for(var i=0; i<targetNumCorridors; i++){
			if(i<4){
				currentObject.generateCorridor( parseInt(mapGrid.length/2), parseInt(mapGrid[0].length/2), targetCorridorMinSize + Math.random()*targetCorridorRandomSize, "random");
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

	this.generateCorridor = function (_startX, _startY, _length, _direction) {
		console.log(targetNumCorridors);
		if(targetNumCorridors < 0){
			return;
		}

		targetNumCorridors -= 1;
		if(_direction == "random"){
			_direction = currentObject.getRandomDirection();
		}

		var corridorX = _startX;
		var corridorY = _startY;

		var corridorDirection = _direction;

		for(var i =0; i< _length; i++ ){
			if(i%targetCorridorStraightness == 0){
				corridorDirection = currentObject.getRandomDirection();
			}

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

			if(i%(targetCorridorStraightness/2) == 0){
				var newCorridor = Math.random();
				if(newCorridor > 0.90) {
					currentObject.generateCorridor( corridorX, corridorY,
					parseInt(Math.random()*targetCorridorRandomSize+targetCorridorMinSize),
					currentObject.getRandomDirection()
					);
				}
			}

			switch(corridorDirection){
				case "left":
					if(corridorX < mapGrid[0].length){
						corridorX += 1;
					} else {
						corridorDirection = currentObject.changeDirection( "changeDirection", corridorDirection );
						i--;
					}
				break;
				case "right":
					if(corridorX > 0){
						corridorX -= 1;
					} else {
						corridorDirection = currentObject.changeDirection( "changeDirection", corridorDirection );
						i--;
					}
				break;
				case "up":
					if(corridorY < mapGrid.length){
						corridorY += 1;
					} else {
						corridorDirection = currentObject.changeDirection( "changeDirection", corridorDirection );
						i--;
					}
				break;
				case "down":
					if(corridorY > 0){
						corridorY -= 1;
					} else {
						corridorDirection = currentObject.changeDirection( "changeDirection", corridorDirection );
						i--;
					}
				break;
			}
			if( currentObject.checkVerticesContent(corridorX, corridorY) == "floor"){
				//corridorDirection = currentObject.changeDirection( "changeDirection", corridorDirection );
			}

			//if able to drill hole
			if(mapGrid[corridorY] != undefined && mapGrid[corridorY][corridorX] != undefined){
				if(mapGrid[corridorY][corridorX] != 2){
					mapGrid[corridorY][corridorX] = 0;
				} else {
					corridorDirection = currentObject.changeDirection( "changeDirection", corridorDirection );
					i--;
				}
			}
			
			
		}

		var newCorridor = Math.random();
		if(newCorridor > 0.70) {
			currentObject.generateCorridor( corridorX, corridorY,
			parseInt(Math.random()*(targetRoomMinSize)),
			currentObject.changeDirection( "changeDirection", corridorDirection )
			);
		} else {
			currentObject.generateRoom(corridorX, corridorY, targetRoomMinSize+Math.random()*targetRoomRandomSize, targetRoomMinSize+Math.random()*targetRoomRandomSize, corridorDirection);
		}

		if(targetNumCorridors > 0){
			currentObject.generateCorridor( corridorX, corridorX,
			targetRoomMinSize,
			currentObject.getRandomDirection()
			);
		}

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