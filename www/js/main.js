
var TILEWIDTH;
var TILEHEIGHT;
var SCREENWIDTH;
var SCREENHEIGHT;

var GAMESPEED = 0.3;


function Main() {

	var currentScreen;

	this.initialize = function () {
		main.updateConstantSize();
		main.changeScreen(2);
	}

	this.changeScreen = function (_which) {
		switch(_which){
			case 2:
				currentScreen = new Gameplay();
			break;
		}

		currentScreen.initialize();
	}

	this.appendContainer = function () {
		if($("#container")){
			$("#container").remove();
		}
		$("body").append("<div id='container' class='mainContainer'></div>");
		$("#container").css("width", window.innerWidth+"px");
		$("#container").css("height", window.innerHeight+"px");
	}

	this.updateConstantSize = function () {
		SCREENWIDTH = window.innerWidth;
		SCREENHEIGHT = window.innerHeight;
		
		if(window.innerWidth == 800){
			TILEWIDTH = 160;
			TILEHEIGHT = 80;
		} else {
			TILEWIDTH = Math.round(window.innerWidth/3);
			TILEHEIGHT = Math.round(TILEWIDTH/2);
		}
		TILEWIDTH = Math.round(window.innerWidth/2);
		TILEHEIGHT = Math.round(TILEWIDTH/2);
	}
}
