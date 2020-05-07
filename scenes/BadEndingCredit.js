class BadEndingCredit extends Phaser.Scene {
    constructor() {
        super({
            key: 'badending'
        });
    }

    preload() {
        //rexui plugin
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });

    }

    create(){
        this.dialog = this.cache.json.get('dialogjson');
        this.cameras.main.setRoundPixels(true);
        this.cameras.main.setBounds(0, 0, 608, 342);
        this.jae = this.add.text(100, 100, "ngaciro").setVisible(false);
        this.credit = this.tweens.createTimeline();
        
        this.credit.add({
            delay: 2000,
            targets: this.jae,
            y: 500,
            duration: 3000,
            onStart: () => {
                cTexBox2(this, 100, 150, {
                    wrapWidth: 400,
                    warna: WHITE,
                })
                .start(this.dialog.lv10.d06, 50);
            }
        });
        this.credit.add({
            delay: 3000,
            targets: this.jae,
            y: 500,
            duration: 4000,
            onStart: () => {
                cTexBox2(this, 100, 150, {
                    wrapWidth: 400,
                    warna: WHITE,
                })
                .start(this.dialog.lv10.d07, 50);
            }
        });
        this.credit.add({
            delay: 2000,
            targets: this.jae,
            y: 500,
            duration: 10000,
            onStart: () => {
                cTexBox2(this, 200, 150, {
                    wrapWidth: 200,
                    warna: WHITE,
                })
                .start(this.dialog.lv10.d08, 200);
            },
            onComplete: () => {
                this.scene.start("menuScene");
            }
        });
        this.credit.play();
    }

}