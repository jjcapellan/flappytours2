class Menu extends Phaser.Scene {
    constructor() {
      super('menu');
    }

    init(){
        let t = this;
        t.gbs = this.registry.get('globals');

        // DOM elements
        t.btplay = document.getElementById("btplay");
        t.bthelp = document.getElementById("bthelp");
        t.btcredits = document.getElementById("btcredits");
        t.lycredits = document.getElementById("credits");
        t.lyhelp = document.getElementById('help');
    }
  
    create(){
        let t = this;
        // DOM listeners
        t.btplay.onclick = this.playButton.bind(t);
        t.bthelp.onclick = this.helpButton;
        t.btcredits.onclick = this.creditsButton;
        t.lycredits.onclick = this.closeCredits;
        t.lyhelp.onclick = this.closeHelp;

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
        this.removeListeners();
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

    removeListeners(){
        let t = this;
        t.btplay.removeEventListener('click', t.playButton);
        t.bthelp.removeEventListener('click', t.helpButton);
        t.btcredits.removeEventListener('click', t.creditsButton);
        t.lycredits.removeEventListener('click', t.closeCredits);
        t.lyhelp.removeEventListener('click', t.closeHelp);
    }
  }
