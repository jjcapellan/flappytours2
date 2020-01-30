export default class LoadScreen extends Phaser.Scene {
    constructor() {
      super('loadScreen');
    }

    init(){
      let gbs = {
        // Best score
        topScore: 0,
        // It's true when actual score > topScore
        newRecord: false,
        // Last game score
        scorePreviousGame: 0,
        // Used in cache
        key_atlas: 'atl_juego'
      }
      this.gbs = gbs;
      this.registry.set('globals', gbs);
    }
  
    preload() {
      let t = this;
      t.load.on('complete',function(){
        t.scene.start('menu');
    }, t);
    t.load.on('progress', this.updateLoad, this);

      // Load music
      t.load.audio('music', require('../../assets/sounds/music/PleasantCreekLoop.mp3'));
      // Load sounds
      t.load.audio('crash', [require('../../assets/sounds/suelo.wav'),require('../../assets/sounds/suelo.mp3')]);
      t.load.audio('gameover', [require('../../assets/sounds/gameover.mp3'),require('../../assets/sounds/gameover.wav')]);
      t.load.audio('flap', [require('../../assets/sounds/aleteo.wav'),require('../../assets/sounds/aleteo.mp3')]);
      t.load.audio('point', [require('../../assets/sounds/punto.wav'),require('../../assets/sounds/punto.mp3')]);
      // Load atlas
      t.load.atlas(t.gbs.key_atlas, require('../../assets/imgs/lowres_ar133/flappy5.png'), require('../../assets/imgs/lowres_ar133/flappy5.json'));      
    }

    updateLoad(progress){
        document.getElementById('p_load').innerHTML = `${Math.round(progress * 100)}%`;
    }
  
  }
  