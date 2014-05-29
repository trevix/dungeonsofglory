
var _sources = ['img/tiles/t_base.png',
				'img/tiles/t_base_1.png',
				'img/tiles/t_base_2.png',
				'img/tiles/t_base_3.png',
				'img/plr_test.png',
                'img/tiles/minimap_wall.png', //5
                'img/tiles/minimap_floor.png',
                'img/buttons/direction_button.png',
                'img/tiles/minimap_hero.png'];



var loadedimages = []
var loadedTiles = [];
var loadedSounds = [];
var loadedPlayerSprites = [];
var preloadNumImagesToLoad = 0;
var loadedImages = false;

function preload(sources)
{
  for (i = 0, length = sources.length; i < length; ++i) {

    loadedimages[i] = new Image();
    loadedimages[i].src = sources[i];
    preloadNumImagesToLoad += 1;
    loadedimages[i].onload = function () {
    	preloadNumImagesToLoad--;
    	if (preloadNumImagesToLoad == 0) {
    		loadedImages = true;
    		main = new Main();
	        main.initialize();
    	}	
    }
    
  }
}

