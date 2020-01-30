import Phaser from './libs/phaser.js';
import LoadScreen from './scenes/loadscreen.js';
import InGame from './scenes/ingame.js';
import Menu from './scenes/menu.js';
import GameOver from './scenes/gameover.js';

function runGame(width, height) {
    var config = {
      type: Phaser.AUTO,
      width: width,
      height: height,
      parent: 'gamediv',
      backgroundColor: 0x000000,
      scale: {
        mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        autoRound: true
      },
      physics: {
        default: 'arcade',
        arcade: {
          debug: false
        }
      },
      scene: [LoadScreen, Menu, InGame, GameOver]
    };
  
    new Phaser.Game(config);
  }
  
  window.onload = function () {
    let gameWidth = 362;
    let gameHeight = 480;

    // Adjust height of "container divs"
    let box = document.getElementById('gamediv');
    // ratio clientWidth/gameWidth
    let widthRatio = box.clientWidth/((362*box.clientHeight/480));
    if (document.styleSheets){
        if(widthRatio < 0.84){
            /* 0.84 = box.clientWidth/((362*newHeight/480)) */
            let newHeight = (480*box.clientWidth)/(0.84*362); // 84% of game width 
            let newTop = (box.clientHeight - newHeight)/2;
            document.styleSheets[0].insertRule(`.fullscreen, .fullscreenflex {bottom: unset; top: ${newTop}px; height: ${newHeight}px;}`, 40);
        }
    }
    runGame(gameWidth, gameHeight);
  };
  