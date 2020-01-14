let helpers = {
    setFlex: (element) => {
        document.getElementById(element).style.display = 'flex';
    },
    setBlock: (element) => {
        document.getElementById(element).style.display = 'block';
    },
    hide: (element) => {
        document.getElementById(element).style.display = 'none';
    },
    setCookie: (c_name, c_value, c_days) => {
        let d = new Date();
        d.setTime(d.getTime() + (c_days * 24 * 60 * 60 * 1000));
        let expires = 'expires=' + d.toUTCString();
        document.cookie = c_name + '=' + c_value + ';' + expires + ';path=/';
    },
    getCookie: (c_name) =>{
        let name = c_name + '=';
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    }
}
class ScrollingLayer {
    /**
     *Creates an instance of ScrollingLayer.
     * @param {Phaser.Scene} scene
     * @param {number} y - vertical position in pixels
     * @param {number} speedX - Horizontal speed in pixels/second
     * @param {number} overlapX - Horizontal overlap in pixels. Prevents empty spaces between images.
     * @param {string} texture - Key of the texture stored in cache.
     * @param {string} [frame] - Optional frame of the texture.
     * @memberof ScrollingLayer
     */
    constructor(scene, y, speedX, overlapX, texture, frame) {
        let t = this;
        t.scene = scene;
        t.y = y;
        t.speed = speedX;
        t.overlap = overlapX;
        t.texture = texture;
        t.frame = frame;
        t.init();
    }

    init() {
        let t = this;
        t.x = 0;
        t.img1 = t.scene.add.image(t.x, t.y, t.texture, t.frame);
        t.img2 = t.scene.add.image(t.img1.width - t.overlap, t.y, t.texture, t.frame);
    }

    setOrigin(x = 0.5, y) {
        if (y == undefined) {
            y = x;
        }
        this.img1.setOrigin(x, y);
        this.img2.setOrigin(x, y);
    }

    getDistance(speed, deltaTime) {
        return (deltaTime * speed) / 1000;
    }

    /**
     * Updates the x position.
     * @param {number} delta - Duration of last game step in miliseconds
     * @memberof ScrollingLayer
     */
    update(delta) {
        let t = this;
        t.img1.x += t.getDistance(t.speed, delta);
        t.img2.x += t.getDistance(t.speed, delta);
        if (t.img1.x < -t.img1.width) {
            t.img1.x = t.img1.width + t.img2.x - t.overlap;
        }
        if (t.img2.x < -t.img2.width) {
            t.img2.x = t.img1.width + t.img1.x - t.overlap;
        }
    }
    
}class LoadScreen extends Phaser.Scene {
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
        document.getElementById('p_carga').innerHTML = `${Math.round(progress * 100)}%`;
    }
  
  }
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
class InGame extends Phaser.Scene {
    constructor() {
        super('inGame');
    }

    init() {
        let t = this;
        t.gbs = t.registry.get('globals');

        // Game width
        t.width = t.game.config.width;
        // Game height
        t.height = t.game.config.height;
        // Game score
        t.score = 0;

        // True if the bird has collided
        t.birdCollided = false;
        /* This variable prevents repeated scoring when going through the pipes. As soon as the pipes pass, it becomes true,
        /* and when they leave the screen it is reset to false. All in the checkPipes() method. */
        t.birdHasScored = false;
        // Vertical velocity of the bird in the click event
        t.birdImpulse = -350;

        // Pipes with
        t.pipeWidth = t.textures.getFrame(t.gbs.key_atlas, 'tuberia').width;
        // Horizontal speed of pipes
        t.pipeSpeed = -180;
        // Horizontal space between pipes
        t.pipeDistance = 200;
        //Pairs of pipes
        t.pairsOfPipes = 2;
        // Position X for a new pair of pipes
        t.posXNewPipe = (t.pairsOfPipes - 1) * (t.pipeDistance + t.pipeWidth) + t.pipeDistance;
        // Initial vertical space between pipes
        t.pipesGap = Math.round(t.height * 0.409);

        // Height of the background sprite that represents the ground
        t.groundHeight = t.textures.getFrame(t.gbs.key_atlas, 'layer3').height;
        // Height of the background sprite that represents the mountains
        t.mountainsHeight = t.textures.getFrame(t.gbs.key_atlas, 'layer2').height;
        // For Parallax effect
        t.mountainsSpeed = -10;
        t.groundSpeed = Math.round(t.pipeSpeed * 1.06);

        t.scoreDOM = document.getElementById('score');

    }

    create() {
        let t = this;
        /* Modifies the limits of the game world, which by default is a rectangle with origin in 0.0 and the size of the game.
        /* This solves collisions with the ground.*/
        t.physics.world.bounds.height = t.game.config.height - 68;

        // Background music
        t.music = t.sound.add('music', { volume: 0.4, loop: true });
        t.music.play();
        t.music.on('stop', () => {
            t.music.play();
        }, t);

        // Sound Effects
        t.crash = this.sound.add('crash', { volume: 1 });
        t.snd_flap = this.sound.add('flap', { volume: 1 });
        t.snd_gameover = this.sound.add('gameover', { volume: 1 });
        t.snd_point = this.sound.add('point', { volume: 1 });

        // Animations
        t.generateAnimations();

        // Background
        t.add.image(0, 0, t.gbs.key_atlas, 'layer1').setOrigin(0, 0);
        //Mountains scrolling layer
        let mountainsY = t.game.config.height - t.groundHeight - t.mountainsHeight + 10;
        /*t.mountains1 = t.add.image(0, mountainsY, t.gbs.key_atlas, 'layer2').setOrigin(0, 0);
        t.mountains2 = t.add.image(t.mountains1.width - 2, mountainsY, t.gbs.key_atlas, 'layer2').setOrigin(0, 0);*/
        t.mountains = new ScrollingLayer(t, mountainsY, t.mountainsSpeed, 2, t.gbs.key_atlas, 'layer2');
        t.mountains.setOrigin(0,0);
        // Pipes group
        t.pipes = t.generatePipes();
        // ForeGround scrolling layer
        t.ground = new ScrollingLayer(t, t.height - t.groundHeight, t.groundSpeed, 2, t.gbs.key_atlas, 'layer3');
        t.ground.setOrigin(0,0);

        // Bird
        t.bird = t.physics.add.sprite(100, t.height / 2, t.gbs.key_atlas, 'pato1');
        t.bird.play('flapping');
        t.bird.setGravityY(1200);
        t.bird.setCollideWorldBounds(true, 0, 0.3);

        // Collider
        t.physics.add.collider(t.bird, t.pipes, t.collision, null, t);

        // Input events
        t.input.on('pointerdown', t.flap, t);

        // Shows actual scene DOM UI
        t.scoreDOM.innerHTML = '0';
        document.getElementById('inGame').style.display = 'block';

        // Debug performance
        let timedEvent = t.time.addEvent({ delay: 1000, callback: t.printFps, callbackScope: t, loop: true });

    }

    printFps(){
        console.log(this.game.loop.actualFps);
    }

    update(time, delta) {
        let t = this;

        //Bird angle
        if (t.bird.angle < 20) {
            t.bird.angle += 1;
        }
        // parallax positions
        if (!t.birdCollided) {
            /*t.mountains1.x += t.getDistance(t.mountainsSpeed, delta);
            t.mountains2.x += t.getDistance(t.mountainsSpeed, delta);
            if (t.mountains1.x < -t.mountains1.width) {
                t.mountains1.x = t.mountains1.width + t.mountains2.x - 2;
            }
            if (t.mountains2.x < -t.mountains2.width) {
                t.mountains2.x = t.mountains1.width + t.mountains1.x - 2;
            }*/
            t.mountains.update(delta);
            t.ground.update(delta);

            /*t.ground1.x += t.getDistance(t.groundSpeed, delta);
            t.ground2.x += t.getDistance(t.groundSpeed, delta);
            if (t.ground1.x < -t.ground1.width) {
                t.ground1.x = t.ground1.width + t.ground2.x - 2;
            }
            if (t.ground2.x < -t.ground2.width) {
                t.ground2.x = t.ground1.width + t.ground1.x - 2;
            }*/
        }

        t.checkPipes();
    }

    getDistance(pixelsSecond, deltaTime) {
        return (deltaTime * pixelsSecond) / 1000;
    }

    generateAnimations() {
        let key = this.gbs.key_atlas;
        this.anims.create({
            key: 'flapping',
            frames: [
                { key: key, frame: 'pato1' },
                { key: key, frame: 'pato2' },
                { key: key, frame: 'pato3' },
                { key: key, frame: 'pato4' },
                { key: key, frame: 'pato5' },
                { key: key, frame: 'pato6' },
                { key: key, frame: 'pato7' },
                { key: key, frame: 'pato8' },
            ],
            frameRate: 10,
            repeat: -1
        });
    }

    generatePipes() {
        let t = this;
        // Pipes physics group
        let group = t.physics.add.group({
            collideWorldBounds: false,
            velocityX: t.pipeSpeed,
            gravityY: 0
        });

        // Adding elements to pipes group
        for (let i = 0; i < t.pairsOfPipes; i++) {
            let ceilingPipeY = -(370 / 2 * t.height / 600) + Math.random() * 130;
            let ceilingPipeX = t.width + 50 + i * (t.pipeWidth + t.pipeDistance);
            let ceilingPipe = t.make.image({
                key: t.gbs.key_atlas,
                frame: 'tuberia',
                x: ceilingPipeX,
                y: ceilingPipeY,
                flipY: true
            }, true);
            ceilingPipe.isUpper = true;
            group.add(ceilingPipe);
            let floorPipeY = ceilingPipe.getBottomCenter().y + t.pipesGap + ceilingPipe.height / 2;
            let floorPipeX = ceilingPipeX;
            let floorPipe = t.make.image({
                key: t.gbs.key_atlas,
                frame: 'tuberia',
                x: floorPipeX,
                y: floorPipeY
            }, true);
            floorPipe.isUpper = false;
            group.add(floorPipe);
        }

        return group;
    }

    flap() {
        let t = this;
        t.bird.setVelocityY(t.birdImpulse);
        //t.twBird.play();
        t.bird.setAngle(-20);
        t.snd_flap.play();
    }

    checkPipes() {
        let t = this;
        let ceilingPipeY;
        let floorPipeY;

        t.pipes.getChildren().forEach(function (item) {
            if (item.body.x < (-t.pipeWidth)) {
                let gapFactor = (t.score < 41) ? (0.4043 - 0.004358 * t.score) : 0.21;
                let newGap = gapFactor * t.height;
                if (item.isUpper) {
                    ceilingPipeY = Math.round(-(175 * t.height / 600) + Math.random() * (320 * t.height / 600));
                    item.body.reset(t.posXNewPipe, ceilingPipeY);
                    ceilingPipeY = item.getBottomCenter().y;
                } else {
                    floorPipeY = ceilingPipeY + item.height / 2 + newGap;
                    item.body.reset(t.posXNewPipe, floorPipeY);
                    t.birdHasScored = false;
                }

                item.body.setVelocityX(t.pipeSpeed);
            } else {
                if (item.x < (t.bird.x - item.width) && !t.birdHasScored) {
                    //Save score
                    t.snd_point.play();
                    t.score++;
                    t.scoreDOM.innerHTML = t.score;
                    t.birdHasScored = true;
                }
            }

        });
    }

    collision(bird, pipe) {
        let t = this;
        //If the bird has already collided before then return
        if (t.birdCollided) {
            return;
        }

        t.birdCollided = true;

        if ("vibrate" in window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(100);
        }

        t.input.removeListener('pointerdown', t.flap, t);

        t.crash.play();
        t.music.removeAllListeners('stop');
        t.music.stop();
        t.snd_gameover.play();

        t.pipes.setVelocityX(0);

        bird.setAngularVelocity(-250);
        bird.setVelocityX(-30);
        bird.setCollideWorldBounds(false);
        pipe.body.setVelocityX(0);
        pipe.body.setVelocityY(0);
        t.cameras.main.shake(200, 0.03);
        t.gbs.scorePreviousGame = this.score;
        this.checkRecord();
        setTimeout(() => {
            helpers.hide('inGame');
            t.pipes.setVisible(false);
            t.scene.pause();
            t.scene.launch('gameOver');
        }, 3500);
    }

    checkRecord() {
        let t = this;
        if (t.score > t.gbs.topScore) {
            helpers.setCookie('best', this.score, 365);
            t.gbs.topScore = this.score;
            t.gbs.newRecord = true;
        }
    }

}
class GameOver extends Phaser.Scene {
    constructor() {
        super('gameOver');
    }

    init() {
        this.gbs = this.registry.get('globals');
    }

    create() {
        let t = this;
        // Game over image
        helpers.setFlex('gameOver');
        let txt_score = '';
        if (this.gbs.newRecord) {
            t.gbs.newRecord = false;
            txt_score = t.gbs.topScore;
            document.getElementById('message').innerHTML = 'NEW RECORD !!!';
        } else {
            txt_score = t.gbs.scorePreviousGame;
        }

        if (Number.isNaN(t.gbs.topScore)) t.gbs.topScore = 0;
        document.getElementById('recuento').innerHTML = txt_score;
        document.getElementById('bestscore').innerHTML = t.gbs.topScore;
        t.input.on('pointerdown', () => {
            helpers.hide('gameOver');
            document.getElementById('message').innerHTML = '';
            t.scene.stop('inGame');
            t.scene.start('menu');
        });
    }
}
function runGame(width, height) {
    var config = {
      type: Phaser.CANVAS,
      /*render:{
        pixelArt: true
      },*/
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
  