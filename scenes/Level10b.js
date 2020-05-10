class Level10b extends Phaser.Scene {
    constructor() {
        super({
            key: 'level10b'
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
        this.dialog = this.cache.json.get('dialogjson');
        this.cameras.main.fadeIn();
        //grup utk menyatukan 4 tombol kontrol
        this.panah = this.add.group();

        this.cameras.main.setRoundPixels(true);

        //tilemap dan pembagian layernya
        this.lvl1 = this.make.tilemap({key: 'lv10'});
        this.tiles = this.lvl1.addTilesetImage('landscape', 'landscapex');
        this.tiles2 = this.lvl1.addTilesetImage('roguelikeSheet_transparent', 'rogueLike');
        this.layer = this.lvl1.createDynamicLayer("00", [this.tiles, this.tiles2], 0, 0);
        this.layer2 = this.lvl1.createDynamicLayer("01", [this.tiles, this.tiles2], 0, 0);
        this.layer2.setSize(5,5);
        //this.objek = this.lvl1.getObjectLayer('objek_layer')['objects'];
        
        //collision / bertumbuk layer
        this.layer2.setCollisionByProperty({collides: true});

        this.nurseJalan = this.anims.create({
            key: 'nursejalan',
            frames: this.anims.generateFrameNumbers('char', {
                frames: [16, 17]
            }),
            frameRate: 8,
            repeat: -1,
        });

        this.aptJalan = this.anims.create({
            key: 'aptjalan',
            frames: this.anims.generateFrameNumbers('char', {
                frames: [21, 22]
            }),
            frameRate: 8,
            repeat: -1,
        });

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

        this.nurse = this.physics.add.sprite(535, 90, "char", 15).setVisible(false);
        this.apt = this.physics.add.sprite(565, 70, "char", 20).setVisible(false);
        this.orang = this.physics.add.sprite(795, 279, "char", 0);
        
        this.orang.body.setSize(10,14);
        this.physics.world.setBounds(0, 0, 800, 480);
        this.orang.body.collideWorldBounds = true;
        this.darah = this.add.particles('darah');
        this.tetesan = this.darah.createEmitter({
            angle: {min: 160, max: 185},
            speed: 10,
            gravityY: 100,
            lifespan: {min: 300, max: 400},
            frequency: 170,
            scale: 1.5,
            follow: this.orang,
            followOffset: {
                x: 5,
                y: -1
            }
        });
        this.layer3 = this.lvl1.createStaticLayer("02", [this.tiles, this.tiles2], 0, -16);
        this.burung = this.add.sprite(565, 70, 'burung').setTint(0xec2049, 0xec2049, 0xf7db4f, 0x45ada8).setVisible(false);
        this.physics.add.collider(this.orang, this.layer2, null, null, this);

        this.cameras.main.startFollow(this.orang, true, 0.09, 0.09);
        this.cameras.main.setBounds(0, 0, 800, 480);
        this.kiri = this.add.sprite(50, 220, 'kontrol', 0).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.bawah = this.add.sprite(50, 300, 'kontrol', 2).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.atas = this.add.sprite(550, 220, 'kontrol', 3).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.kanan = this.add.sprite(550, 300, 'kontrol', 1).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.panah.addMultiple([this.kiri, this.bawah, this.atas, this.kanan]);

        this.triggerEnd = this.add.zone(400, 260, 16, 5).setOrigin(0);
        this.physics.add.existing(this.triggerEnd);
        this.triggerEnd.body.setImmovable();
        this.physics.add.collider(this.orang, this.triggerEnd, () => {
            this.burung.setVisible(true);
            this.triggerEnd.destroy();
            this.sengBoleLewat2.destroy();
            this.cutScn.play();
            this.nurse.setVisible(true);
            this.apt.setVisible(true);
            this.panah.setVisible(false);
            this.orang.setVelocity(0)
            this.orang.anims.stop();
        }, null, this);

        this.sengBoleLewat = this.add.zone(704, 60, 96, 5).setOrigin(0);
        this.physics.add.existing(this.sengBoleLewat);
        this.sengBoleLewat.body.setImmovable();
        this.physics.add.collider(this.orang, this.sengBoleLewat, () => {
            this.orang.anims.stop();
            this.panah.setVisible(false);
            createTextBox(this, 10, 10, {
                wrapWidth: 550,
            })
            .start(this.dialog.lv10.d01, 50);
        }, null, this);

        this.sengBoleLewat2 = this.add.zone(300, 279, 5, 120).setOrigin(0);
        this.physics.add.existing(this.sengBoleLewat2);
        this.sengBoleLewat2.body.setImmovable();
        this.physics.add.collider(this.orang, this.sengBoleLewat2, () => {
            this.orang.anims.stop();
            this.panah.setVisible(false);
            createTextBox(this, 10, 10, {
                wrapWidth: 550,
            })
            .start(this.dialog.lv10.d01, 50);
        }, null, this);

        this.kiri.on('pointerdown', () => {
            this.orang.setVelocityX(-30);
            this.orang.play('jalan');
        });

        this.kiri.on('pointerup', () => {
            this.orang.setVelocity(0);
            this.orang.anims.stop();
        });

        this.bawah.on('pointerdown', () => {
            this.orang.setVelocityY(30);
            this.orang.play('jalan');
        });

        this.bawah.on('pointerup', () => {
            this.orang.setVelocity(0);
            this.orang.anims.stop();
        });

        this.atas.on('pointerdown', () => {
            this.orang.setVelocityY(-30);
            this.orang.play('jalanAtas');
        });

        this.atas.on('pointerup', () => {
            this.orang.setVelocity(0);
            this.orang.anims.stop();
        });

        this.kanan.on('pointerdown', () => {
            this.orang.setVelocityX(30);
            this.orang.play('jalan');
        });

        this.kanan.on('pointerup', () => {
            this.orang.setVelocity(0);
            this.orang.anims.stop();
        });

        this.atas.on('pointerup', () => {
            this.orang.setVelocity(0);
            this.orang.anims.stop();
        });

        this.aptEnd = this.tweens.createTimeline();
        this.orgEnd = this.tweens.createTimeline();

        this.aptEnd.add({
            delay: 1000,
            targets: this.apt,
            x: 543,
            duration: 2000,
            onStart: () => {
                this.apt.play('aptjalan');
            },
            onComplete: () => {
                this.apt.anims.stop();
            }
        });
        this.aptEnd.add({
            targets: this.apt,
            y: 105,
            duration: 1500,
            onStart: () => {
                this.apt.play('aptjalan');
            },
            onComplete: () => {
                this.apt.anims.stop();
            }
        });
        this.aptEnd.add({
            delay: 1000,
            targets: this.apt,
            x: 410,
            duration: 6000,
            onStart: () => {
                this.apt.play('aptjalan');
            },
            onComplete: () => {
                this.apt.anims.stop();
            }
        });
        this.aptEnd.add({
            targets: this.apt,
            y: 150,
            duration: 5000,
            onStart: () => {
                this.apt.play('aptjalan');
            },
            onComplete: () => {
                this.apt.anims.stop();
            }
        });
        this.orgEnd.add({
            delay: 5500,
            targets: this.orang,
            x: 410,
            duration: 6000,
            onStart: () => {
                this.orang.play('jalan');
            },
            onComplete: () => {
                this.orang.anims.stop();
            }
        });
        this.orgEnd.add({
            targets: this.orang,
            y: 150,
            duration: 5000,
            onStart: () => {
                this.orang.play('jalan');
                this.cameras.main.fadeOut(4500);
            },
            onComplete: () => {
                this.orang.anims.stop();
                this.scene.start('lv10bb');
            }
        });

        this.ending = this.tweens.createTimeline();
        this.ending.add({
            targets: this.sengBoleLewat,
            y: this.sengBoleLewat.y,
            duration: 3000,
            onStart: () =>{
                cTexBox2(this, 10, 10, {
                    wrapWidth: 550,
                    warna: YELLOW,
                })
                .start(this.dialog.lv10b.d01, 50);
            },
            onComplete: () => {
                cTexBox2(this, 10, 10, {
                    wrapWidth: 550,
                    warna: YELLOW,
                })
                .start(this.dialog.lv10b.d02, 50);
            }
        });
        this.ending.add({
            delay: 3000,
            targets: this.orang,
            y: 215,
            duration: 3000,
            onStart: () => {
                this.orang.play('jalanAtas');
                //this.brgEnd.play();
            },
            onComplete: () => {
                this.orang.anims.stop();
            }
        });
        this.ending.add({
            delay: 1000,
            targets: this.orang,
            x: 470,
            duration: 3000,
            onStart: () => {
                this.orang.play('jalan');
            },
            onComplete: () => {
                this.orang.anims.stop();
            }
        });
        this.ending.add({
            delay: 1000,
            targets: this.orang,
            y: 150,
            duration: 3000,
            onStart: () => {
                this.orang.play('jalanAtas');
            },
            onComplete: () => {
                this.orang.anims.stop();
            }
        });
        this.ending.add({
            delay: 1000,
            targets: this.orang,
            x: 535,
            duration: 3000,
            onStart: () => {
                this.orang.play('jalan');
            },
            onComplete: () => {
                this.orang.anims.stop();
            }
        });
        this.ending.add({
            delay: 1000,
            targets: this.orang,
            y: 110,
            duration: 3000,
            onStart: () => {
                this.orang.play('jalanAtas');
            },
            onComplete: () => {
                this.orang.anims.stop();
            }
        });

        this.ending.add({
            delay: 500,
            targets: this.burung,
            y: 50,
            x: 535,
            duration: 1000,
            ease: 'Power1'
        });

        this.ending.add({
            delay: 1000,
            targets: this.nurse,
            y: this.nurse.y,
            duration: 3000,
            onStart: () => {
                cTexBox2(this, 400, 10, {
                    wrapWidth: 550,
                    warna: '0xff7676',
                })
                .start(this.dialog.lv10b.d03, 50);
            }
        });

        this.ending.add({
            delay: 1000,
            targets: this.nurse,
            y: this.nurse.y,
            duration: 3000,
            onStart: () => {
                cTexBox2(this, 390, 10, {
                    wrapWidth: 450,
                    warna: '0xff7676',
                })
                .start(this.dialog.lv10b.d04, 50);
            }
        });

        this.ending.add({
            delay: 1000,
            targets: this.nurse,
            y: this.nurse.y,
            duration: 3000,
            onStart: () => {
                cTexBox2(this, 400, 10, {
                    wrapWidth: 550,
                    warna: '0xff7676',
                })
                .start(this.dialog.lv10b.d05, 50);
            }
        });

        this.ending.add({
            delay: 1000,
            targets: this.nurse,
            y: this.nurse.y,
            duration: 3000,
            onStart: () => {
                cTexBox2(this, 400, 10, {
                    wrapWidth: 550,
                    warna: '0xff7676',
                })
                .start(this.dialog.lv10b.d06, 50);
            }
        });

        this.ending.add({
            delay: 1000,
            targets: this.nurse,
            x: 410,
            duration: 2000,
            onStart: () => {
                this.nurse.play('nursejalan');
            },
            onComplete: () => {
                this.nurse.anims.stop();
            }
        });

        this.ending.add({
            delay: 1000,
            targets: this.nurse,
            y: 150,
            duration: 2000,
            onStart: () => {
                this.nurse.play('nursejalan');
            },
            onComplete: () => {
                this.nurse.destroy();
                this.aptEnd.play();
                this.orgEnd.play();
            }
        });

        this.burung.play('terbang');
        this.cutScn = this.tweens.add({
            targets: this.burung,
            x: 0,
            y: 0,
            ease: 'Circ.easeInOut',
            duration: 5000,
            paused: true,
            onComplete: () => {
                this.ending.play();
            }
        });

        this.animatedTiles.init(this.lvl1);
        
    }

    update() {
        if (this.cutScn.isPlaying()){
            this.cutScn.updateTo('x', this.orang.x, true);
            this.cutScn.updateTo('y', this.orang.y - 40, true);
        }

    }

}