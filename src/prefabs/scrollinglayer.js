export default class ScrollingLayer {
    /**
     *Creates an instance of ScrollingLayer.
     * @param {Phaser.Scene} scene     
     * @param {number} speed - Horizontal speed in pixels/second.    
     * @param {string} texture - Key of the texture stored in cache.
     * @param {object} [options]
     * @param {string} [options.frame] - Optional frame of the texture.
     * @param {number} [options.y] - vertical position in pixels. By default the texture is positioned at bottom.
     * @param {number} [options.overlap = 1] - Horizontal overlap in pixels (default 1). Prevents empty spaces between images.
     * @memberof ScrollingLayer
     */
    constructor(scene, speed, texture, {frame = null, y = null, overlap = 1} = {}) {
        let t = this;
        t.scene = scene;
        t.y = y;
        t.speed = speed;
        t.overlap = overlap;
        t.texture = texture;
        t.frame = frame;
        t.init();
    }

    init() {
        let t = this;
        t.width = t.scene.textures.getFrame(t.texture, t.frame).width;
        t.height = t.scene.textures.getFrame(t.texture, t.frame).height;
        if(t.y == null){
            t.setYbottom();
        }
        t.blitter = t.scene.add.blitter(0, t.y, t.texture, t.frame);
        t.img1 = t.blitter.create(0,0);
        t.img2 = t.blitter.create(t.width - t.overlap, 0);
    }

    getDistance(speed, deltaTime) {
        return (deltaTime * speed) / 1000;
    }

    setYbottom(){
        this.y = this.scene.game.config.height - this.height;
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
        if (t.img1.x < -t.width) {
            t.img1.x = t.width + t.img2.x - t.overlap;
        }
        if (t.img2.x < -t.width) {
            t.img2.x = t.width + t.img1.x - t.overlap;
        }
    }
    
}