class Level08 extends Phaser.Scene {
    constructor() {
        super({
            key: 'level08'
        });
    }

    preload() {
        //plugin animated tiles
        this.load.scenePlugin({
            key: 'AnimatedTiles',
            url: 'AnimatedTiles.min.js',
            systemKey: 'animatedTiles',
            sceneKey: 'animatedTiles'
        });

        //rexui plugin
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });

    }

    create() {
        this.cameras.main.fadeIn();
        //grup utk menyatukan 4 tombol kontrol
        this.panah = this.add.group();

        this.cameras.main.setRoundPixels(true);

        //tilemap dan pembagian layernya
        this.lvl1 = this.make.tilemap({key: 'lv08'});
        this.tiles = this.lvl1.addTilesetImage('landscape', 'landscapex');
        this.tiles2 = this.lvl1.addTilesetImage('roguelikeSheet_transparent', 'rogueLike');
        this.layer = this.lvl1.createDynamicLayer("00", [this.tiles, this.tiles2], 0, 0);
        this.layer2 = this.lvl1.createDynamicLayer("01", [this.tiles, this.tiles2], 0, 0);
        this.objek = this.lvl1.getObjectLayer('objek_layer')['objects'];
        
        //collision / bertumbuk layer
        this.layer2.setCollisionByProperty({collides: true});

        this.animasiMati = this.anims.create({
            key: 'mati',
            frames: this.anims.generateFrameNumbers('char', {
                frames: [13, 12]
            }),
            frameRate: 2,
        });

        //animasi jalan player
        this.animasiJalan = this.anims.create({
            key: 'jalan',
            frames: this.anims.generateFrameNumbers('char', {
                frames: [1, 2]
            }),
            frameRate: 8,
            repeat: -1,
        });

        this.animasiJalanAtas = this.anims.create({
            key: 'jalanAtas',
            frames: this.anims.generateFrameNumbers('char', {
                frames: [3, 4]
            }),
            frameRate: 8,
            repeat: -1,
        });
        this.terbang = this.anims.create({
            key: 'terbang',
            frames: this.anims.generateFrameNumbers('burung'),
            frameRate: 8,
            repeat: -1
        });

        this.orang = this.physics.add.sprite(this.objek[0].x, this.objek[0].y, "char", 0).setTint(0x00FF00, 0x00FF00, 0xFFFFFF, 0xFFFFFF);
        
        this.orang.body.setSize(10,13);
        this.physics.world.setBounds(0, 0, 1280, 480);
        this.orang.body.collideWorldBounds = true;
        this.layer3 = this.lvl1.createStaticLayer("02", [this.tiles, this.tiles2], 0, -16);
        this.burung = this.add.sprite(1300, 240, 'burung').setTint(0x0000ff, 0xffff00, 0x0000ff, 0xff0000);
        this.physics.add.collider(this.orang, this.layer2, null, null, this);

        this.cameras.main.startFollow(this.orang, true, 0.09, 0.09);
        this.cameras.main.setBounds(0, 0, 1280, 480);
        this.kiri = this.add.sprite(550, 225, 'kontrol', 0).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.atas = this.add.sprite(50, 220, 'kontrol', 3).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.bawah = this.add.sprite(50, 300, 'kontrol', 2).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.reset = this.add.sprite(550, 300, 'kontrol', 4).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.panah.addMultiple([this.kiri, this.bawah, this.atas, this.reset]);
        this.pergi = this.add.bitmapText(200, 120, 'gem', "Reset!", 80).setScrollFactor(0).setTint(0x000000).setVisible(false);
        //goToNextLevel
        this.zonLv = this.add.zone(0, 0, 1, 480).setOrigin(0);
        this.physics.add.existing(this.zonLv);
        this.zonLv.body.setImmovable();
        this.physics.add.collider(this.orang, this.zonLv, () => {
            this.cameras.main.fadeOut(500);
            localStorage.setItem("currentLevel", "level09");
            setTimeout(() => this.scene.start("level09"), 1000);
        }, null, this);

        this.kiri.on('pointerdown', () => {
            this.orang.setVelocityX(-60);
            this.orang.play('jalan');
        });

        this.kiri.on('pointerup', () => {
            this.orang.setVelocity(0);
            this.orang.anims.stop();
        });

        this.bawah.on('pointerdown', () => {
            this.orang.setVelocityY(60);
            this.orang.play('jalan');
        });

        this.bawah.on('pointerup', () => {
            this.orang.setVelocity(0);
            this.orang.anims.stop();
        });

        this.atas.on('pointerdown', () => {
            this.orang.setVelocityY(-60);
            this.orang.play('jalanAtas');
        });

        this.reset.on('pointerdown', () => {
            this.panah.setVisible(false);
            this.pergi.setVisible(true);
            this.cameras.main.fadeOut(2700, 90, 197, 208);
            setTimeout(() => {
                this.scene.restart();
            }, 2700);
        });

        this.atas.on('pointerup', () => {
            this.orang.setVelocity(0);
            this.orang.anims.stop();
        });

        this.burung.play('terbang');
        this.tweens.add({
            targets: this.burung,
            x: -10,
            ease: 'Power1',
            duration: 8000
        });

        this.animatedTiles.init(this.lvl1);
        this.darah = this.add.particles('darah');
        this.tetesan = this.darah.createEmitter({
            angle: {min: 160, max: 185},
            speed: 10,
            gravityY: 100,
            lifespan: {min: 400, max: 500},
            frequency: 170,
            scale: 1.5,
            follow: this.orang,
            followOffset: {
                x: 5,
                y: 4
            }
        });
    }

    update() {

    }

}