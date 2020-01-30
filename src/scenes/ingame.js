import ScrollingLayer from '../prefabs/scrollinglayer';
import {helpers} from '../prefabs/helpers';

export default class InGame extends Phaser.Scene {
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
        //t.mountains = new ScrollingLayer(t, mountainsY, t.mountainsSpeed, 2, t.gbs.key_atlas, 'layer2');
        t.mountains = new ScrollingLayer(t, t.mountainsSpeed, t.gbs.key_atlas, {frame: 'layer2', y: mountainsY})

        // Pipes group
        t.pipes = t.generatePipes();

        // ForeGround scrolling layer
        //t.ground = new ScrollingLayer(t, t.height - t.groundHeight, t.groundSpeed, 2, t.gbs.key_atlas, 'layer3');
        t.ground = new ScrollingLayer(t, t.groundSpeed, t.gbs.key_atlas, {frame: 'layer3'});

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

        t.physics.world.pause();

        // Debug performance
        //let timedEvent = t.time.addEvent({ delay: 1000, callback: t.printFps, callbackScope: t, loop: true });

    }

    /*printFps(){
        console.log(this.game.loop.actualFps);
    }*/

    update(time, delta) {
        let t = this;

        t.preUpdateBodies();
        t.physics.world.step(0.001 * delta);

        //Bird angle
        if (t.bird.angle < 20) {
            t.bird.angle += 1;
        }
        // parallax positions
        if (!t.birdCollided) {
            t.mountains.update(delta);
            t.ground.update(delta);
        }

        t.checkPipes();
    }

    preUpdateBodies(){
        let body;
        let bodies = this.physics.world.bodies.entries;

        for (let i = 0; i < bodies.length; i++)
        {
            body = bodies[i];

            this.preUpdateBody(body);
        }
    }

    preUpdateBody(body){
        body.resetFlags();
        body.updateBounds();

        var sprite = body.transform;

        body.position.x = sprite.x + sprite.scaleX * (body.offset.x - sprite.displayOriginX);
        body.position.y = sprite.y + sprite.scaleY * (body.offset.y - sprite.displayOriginY);

        body.updateCenter();

        body.rotation = sprite.rotation;

        body.preRotation = body.rotation;

        if (body.moves)
        {
            body.prev.x = body.position.x;
            body.prev.y = body.position.y;
            body.prevFrame.x = body.position.x;
            body.prevFrame.y = body.position.y;
        }
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
                if (item.body.right < t.bird.body.left && !t.birdHasScored) {
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
