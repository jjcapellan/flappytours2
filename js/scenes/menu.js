class Menu extends Phaser.Scene {
    constructor() {
      super('menu');
    }

    init(){
        this.gbs = this.registry.get('globals');
    }
  
    create(){
        let t = this;
        // DOM listeners
        document.getElementById("btplay").onclick = this.playButton.bind(t);
        document.getElementById("bthelp").onclick = this.helpButton;
        document.getElementById("btcredits").onclick = this.creditsButton;
        document.getElementById("credits").onclick = this.closeCredits;
        document.getElementById('help').onclick = this.closeHelp;

        // Sky
        this.add.image(0,0,t.gbs.key_atlas, 'layer1').setOrigin(0,0);
        // Ground
        let ground = this.add.image(0,0,t.gbs.key_atlas, 'layer3').setOrigin(0,0);
        ground.setY(this.game.config.height - ground.height);
        this.gbs.groundHeight = ground.height;
        // Mountains
        let mountains = this.add.image(0,0,t.gbs.key_atlas,'layer2').setOrigin(0,0);
        mountains.setY(this.game.config.height - ground.height - mountains.height + 10);
        this.gbs.mountainsHeight = mountains.height;

        //Global variables initialization
        this.gbs.topScore = helpers.getCookie('best') ? parseInt(helpers.getCookie('best')) : 0;

        // Hide previus DOM scene
        helpers.hide('loading');

        // Shows the DOM UI of this scene
        document.getElementById('menu').style.display = 'flex';
    }

    // Buttons handlers
    playButton() {
        helpers.hide('menu');
        this.scene.start('inGame');        
    } 

    helpButton(){
        helpers.setFlex('help');
    }

    creditsButton(){
        helpers.setFlex('credits');
    }

    closeCredits(){
        helpers.hide('credits');
    }

    closeHelp(){
        helpers.hide('help');
    }
  }