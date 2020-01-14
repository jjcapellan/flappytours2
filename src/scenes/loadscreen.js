class LoadScreen extends Phaser.Scene {
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
      t.load.audio('music', 'assets/sounds/music/PleasantCreekLoop.mp3');
      // Load sounds
      t.load.audio('crash', ['assets/sounds/suelo.wav', 'assets/sounds/suelo.mp3']);
      t.load.audio('gameover', ['assets/sounds/gameover.mp3', 'assets/sounds/gameover.wav']);
      t.load.audio('flap', ['assets/sounds/aleteo.wav', 'assets/sounds/aleteo.mp3']);
      t.load.audio('point', ['assets/sounds/punto.wav', 'assets/sounds/punto.mp3']);
      // Load atlas
      t.load.atlas(t.gbs.key_atlas, 'assets/imgs/lowres_ar133/flappy5.png', 'assets/imgs/lowres_ar133/flappy5.json');      
    }

    updateLoad(progress){
        document.getElementById('p_load').innerHTML = `${Math.round(progress * 100)}%`;
    }
  
  }
  