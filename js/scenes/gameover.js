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
