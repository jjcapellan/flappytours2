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
        t.width = t.scene.textures.getFrame(t.texture, t.frame).width;
        t.blitter = t.scene.add.blitter(0, t.y, t.texture, t.frame);
        t.x = 0;
        t.img1 = t.blitter.create(t.x,0);
        t.img2 = t.blitter.create(t.width - t.overlap, 0);
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
        if (t.img1.x < -t.width) {
            t.img1.x = t.width + t.img2.x - t.overlap;
        }
        if (t.img2.x < -t.width) {
            t.img2.x = t.width + t.img1.x - t.overlap;
        }
    }
    
}