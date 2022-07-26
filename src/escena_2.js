export default class escena_2 extends Phaser.Scene {
  constructor(config) {
    super("escena_2");
  }

  init(data) {
    this.errores = 0;
  }

  create() {
    
    // this.win();
    this.add.image(960, 537, "clase1", "fondo");
    this.add.image(906, 720, "clase1", "familia");

    let rect = this.add.rectangle(0, 0, 1920, 1080, 0x000, 0.8).setOrigin(0).setDepth(6);
    let play_again = this.add.image(959, 540, "clase1", "play1").setDepth(9).setInteractive({useHandCursor: true});

    this.add.tween({
      targets: [play_again],
      scale: { start: 0.9, to: 1.2 },
      duration: 500,
      yoyo:true,
      repeat:-1,
      ease: "Linear",
    });

    
    play_again.once("pointerdown", () => {
      rect.destroy();
      play_again.destroy();
      this.initGame();
    });

  }

  initGame() {
    const total = 6;
    this.current = 0;
    this.sound.play('inicio',{volume: 0.1, loop:true});

    let dropzone1 = this.add.image(826, 316, "clase1", "dropzone_1").setInteractive({ dropZone: true }).setName("1").setDepth(2);
    let dropzone2 = this.add.image(1181, 348, "clase1", "dropzone_2").setInteractive({ dropZone: true }).setName("2").setDepth(2);
    let dropzone3 = this.add.image(1423, 518, "clase1", "dropzone_3").setInteractive({ dropZone: true }).setName("3").setDepth(2);
    let dropzone4 = this.add.image(1622, 770, "clase1", "dropzone_4").setInteractive({ dropZone: true }).setName("4").setDepth(2);
    let dropzone5 = this.add.image(846, 999, "clase1", "dropzone_5").setInteractive({ dropZone: true }).setName("5").setDepth(2);
    let dropzone6 = this.add.image(310, 903, "clase1", "dropzone_6").setInteractive({ dropZone: true }).setName("6").setDepth(2);

    let items = [];
    for (let i = 1; i <= 6; i++) {
      items.push(this.add.image(0, 0, "clase1", "draggable_" + i).setName(i));
    }

    Phaser.Math.RND.shuffle(items);

    let targets = [
      dropzone1,
      dropzone2,
      dropzone3,
      dropzone4,
      dropzone5,
      dropzone6
    ].concat(items);
    targets.forEach(target => target.setAlpha(0));
    this.tweens.add({
      targets,
      y: {
        from: -500,
        to: function(target, key, value) {
          return target.y;
        }
      },
      alpha: { start: 0, to: 1 },
      duration: 500,
      delay: this.tweens.stagger(200),
      ease: "Quad.easeOut"
    });

    Phaser.Actions.PlaceOnRectangle(items,new Phaser.Geom.Rectangle(280, 70, 1400, 70));

    for (const item of items) {
      let dropped = false;
      let initX;
      let initY;

      item.setInteractive({ useHandCursor: true, draggable: true });
      item.setDepth(3);
      item.on("drag", (pointer, dragX, dragY) => {
        item.setPosition(dragX, dragY);
        initX = item.input.dragStartX;
        initY = item.input.dragStartY;
      });

      item.on("dragstart", () => {
        dropped = false;
      });
      item.on("dragend", () => {
        if (dropped) return;
        this.add.tween({
          targets: item,
          x: item.input.dragStartX,
          y: item.input.dragStartY,
          duration: 200,
          ease: "Quad.easeOut"
        });
      });
        
      item.on('dragenter', function (pointer) {
        item.setAlpha ( 0.5 );
      });
      item.on('dragleave', function (pointer) {
        item.setAlpha ( 1 );
      });

      item.on("drop", (pointer, dropzone) => {
        item.setAlpha ( 1 );
      console.log(item.name);
        if (item.name == dropzone.name) {

          switch (item.name) {
            case 1: this.sound.play('a1'); break;
            case 2: this.sound.play('a2'); break;
            case 3: this.sound.play('a3'); break;
            case 4: this.sound.play('a4'); break;
            case 5: this.sound.play('a5'); break;
            case 6: this.sound.play('a6'); break;
          }

          // this.sound.play('correct');
         dropped = true;
        dropzone.removeInteractive();
        item.removeInteractive(); 
          this.add.tween({
            targets: item,
            x: dropzone.x,
            y: dropzone.getTopLeft().y + 35,
            duration: 200,
            ease: "Quad.easeOut",
            onComplete: () => {
              this.current += 1;
              if (this.current >= total) {
                setTimeout(() =>{                   
                  this.win();
                 }, 2000);
              }
            }
          });
        }
        else{
          this.sound.play('error');
          this.add.tween({
            targets: item,
            x: initX,
            y: initY,
            duration: 200,
            ease: "Quad.easeOut"
          });
        }
      });
    }
  }

  win() {

    let rect = this.add.rectangle(0, 0, 1920, 1080, 0x000, 0.8).setOrigin(0).setDepth(6);
    // let char = this.add.image(959, 540, "clase1", "2").setDepth(9);
    let text = this.add.image(963, 800, "clase1", "very_good").setDepth(9);
    let play_again = this.add.image(959, 540, "clase1", "play1").setDepth(9).setInteractive({useHandCursor: true});
    play_again.setScale(0.3);

    this.add.tween({
      targets: [text,play_again],
      scale: { start: 0, to: 1 },
      duration: 500,
      ease: "Bounce.easeOut",
      delay: this.tweens.stagger(100)
    });

    this.sound.play('win');
    play_again.once("pointerdown", () => {
      this.sound.stopAll();
      this.scene.restart();
    });


    var p0 = new Phaser.Math.Vector2(550, 750);
    var p1 = new Phaser.Math.Vector2(550, 100);
    var p2 = new Phaser.Math.Vector2(1400, 100);
    var p3 = new Phaser.Math.Vector2(1400, 750);

    var curve = new Phaser.Curves.CubicBezier(p0, p1, p2, p3);

    var max = 28;
    var points = [];
    var tangents = [];

    for (var c = 0; c <= max; c++)
    {
        var t = curve.getUtoTmapping(c / max);

        points.push(curve.getPoint(t));
        tangents.push(curve.getTangent(t));
    }

    var tempVec = new Phaser.Math.Vector2();

    var spark0 = this.add.particles('spark0').setDepth(8);
    var spark1 = this.add.particles('spark1').setDepth(8);

    for (var i = 0; i < points.length; i++)
    {
        var p = points[i];
        tempVec.copy(tangents[i]).normalizeRightHand().scale(-32).add(p);
        var angle = Phaser.Math.RadToDeg(Phaser.Math.Angle.BetweenPoints(p, tempVec));
        var particles = (i % 2 === 0) ? spark0 : spark1;

        particles.createEmitter({
            x: tempVec.x,
            y: tempVec.y,
            angle: angle,
            speed: { min: -100, max: 500 },
            gravityY: 200,
            scale: { start: 0.4, end: 0.1 },
            lifespan: 800,
            blendMode: 'SCREEN'
        });
    }

  }

 
}
