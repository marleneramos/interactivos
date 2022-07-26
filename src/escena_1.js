export default class escena_1 extends Phaser.Scene {
  constructor(config) {
    super("escena_1");
  }

  init(data) {
    this.errores = 0;
  }

  create() {
    this.add.image(0, 0, "caso_1", "fondo").setOrigin(0);
    // this.tutorial();
    this.initGame();
  }

  initGame() {
    this.scene.launch("ui");

    let hint = this.add.image(445, 110, "caso_1", "hint");
    let text = this.add.image(955, 435, "caso_1", "reto");

    const total = 3;
    this.current = 0;

    let dropzone1 = this.add.image(1175, 520, "caso_1", "drop").setInteractive({ dropZone: true }).setName("2");
    let dropzone2 = this.add.image(1120, 430, "caso_1", "drop").setInteractive({ dropZone: true }).setName("3");
    let dropzone3 = this.add.image(1320, 350, "caso_1", "drop").setInteractive({ dropZone: true }).setName("1");

    // let items2 = [];
    // for (let i = 1; i <= 5; i++) {
    //   items2.push(this.add.image(0, 0, "cuad1").setAlpha(0.6));
    // }

    // Phaser.Actions.PlaceOnLine(items2,new Phaser.Geom.Line(500, 880, 1642, 880));

    let items = [];
    for (let i = 1; i <= 5; i++) {
      items.push(this.add.image(0, 0, "caso_1", "item_" + i).setName(i));
    }

    let targets = [hint, text, dropzone1, dropzone2, dropzone3].concat(items);
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
    
    Phaser.Actions.PlaceOnLine(
      items,
      new Phaser.Geom.Line(500, 880, 1650, 880)
    );
    
    for (const item of items) {
      let dropped = false;
      item.setInteractive({ useHandCursor: true, draggable: true });

      item.on("drag", (pointer, dragX, dragY) => {
        item.setPosition(dragX, dragY);
        item.input.dragStartX;
        // items2[item.name-1].setAlpha(0.6);
      });
      
      item.on("dragstart", () => {
        dropped = false;
      });

      item.on('dragenter', function (pointer, gameObject, dropZone) {
        item.setAlpha ( 0.8 );
      });
      item.on('dragleave', function (pointer, gameObject, dropZone) {
        item.setAlpha ( 1 );
      });

      item.on("dragend", () => {
        item.setAlpha ( 1 );
        if (dropped) return;
        this.add.tween({
          targets: item,
          x: item.input.dragStartX,
          y: item.input.dragStartY,
          duration: 200,
          ease: "Quad.easeOut"
        });
      });

      item.on("drop", (pointer, dropzone) => {
        item.setAlpha ( 1 );
        // for (const itms of items2) {
        //   itms.setAlpha(0.6);
        // }
        dropped = true;
        dropzone.removeInteractive();
        item.setFrame((item.frame.name += "_dropped")).removeInteractive();
        this.add.tween({
          targets: item,
          x: dropzone.x,
          y: dropzone.y,
          duration: 200,
          ease: "Quad.easeOut",
          onComplete: () => {
            this.current += 1;
            if (this.current >= total) {
              this.errores == 0 ? this.win() : this.lose();
            }
          }
        });
        if (item.name != dropzone.name) {
          this.errores += 1;
          // window.parent.postMessage({string:"au_er"}, "*");
        }
        else{
          // window.parent.postMessage({ string: "au_ok" }, "*");
        }
      });
    }
  }

  tutorial() {
    let rect = this.add
      .rectangle(0, 0, 1920, 1080, 0x000, 0.6)
      .setOrigin(0)
      .setInteractive();

    let instruccion_1 = this.add.image(960, 230, "caso_1", "instrucciones_1");
    let instruccion_2 = this.add.image(960, 470, "caso_1", "instrucciones_2");
    let instruccion_3 = this.add.image(835, 850, "caso_1", "instrucciones_3");
    let instruccion_5 = this.add.image(960, 670, "caso_1", "instrucciones_5");
    let instruccion_4 = this.add.image(1410, 865, "caso_1", "instrucciones_4");

    this.add.tween({
      targets: instruccion_4,
      y: 700,
      yoyo: true,
      duration: 1500,
      ease: "Quad.easeInOut",
      repeat: -1,
      loop: true
    });

    let timeline = this.tweens.timeline();
    timeline
      .add({
        targets: instruccion_1,
        y: { start: -200, to: 230 },
        ease: "Quad.easeOut",
        duration: 500
      })
      .add({
        targets: instruccion_2,
        y: { start: -200, to: 470 },
        ease: "Quad.easeOut",
        duration: 500
      })
      .add({
        targets: instruccion_3,
        y: { start: -200, to: 810 },
        ease: "Quad.easeOut",
        duration: 500
      })
      .add({
        targets: instruccion_5,
        y: { start: -200, to: 670 },
        ease: "Quad.easeOut",
        duration: 500
      });
    timeline.play();
    rect.once("pointerdown", () => {
      this.add.tween({
        targets: [
          instruccion_1,
          instruccion_2,
          instruccion_3,
          instruccion_5,
          instruccion_4,
          rect
        ],
        ease: "Quad.easeOut",
        duration: 500,
        alpha: 0,
        onComplete: () => {
          instruccion_1.destroy();
          instruccion_2.destroy();
          instruccion_3.destroy();
          instruccion_4.destroy();
          instruccion_5.destroy();
          rect.destroy();
          this.initGame();
        }
      });
    });
  }

  win() {
    let ui = this.scene.get("ui");
    ui.events.emit("pause");
    ui.score += 1000;
    let rect = this.add.rectangle(0, 0, 1920, 1080, 0x000, 0.6).setOrigin(0);
    let char = this.add.image(735, 500, "caso_1", "char_win");
    let text = this.add.image(1215, 465, "caso_1", "text_win");
    let pts = this.add.image(1210, 735, "caso_1", "pts");

    this.add.tween({
      targets: [char, text, pts],
      scale: { start: 0, to: 1 },
      duration: 500,
      ease: "Bounce.easeOut",
      delay: this.tweens.stagger(100)
    });

    let total = this.add
      .text(1060, 625, "")
      .setFontFamily("MontserratBold")
      .setColor("#00AE19")
      .setFontSize(80)
      .setAlign("center");
    let tween = this.tweens.addCounter({
      from: 0,
      to: 1000,
      duration: 2000,
      ease: "Quad.easeOut",
      onUpdate: () => {
        total.setText(`+ ${Math.round(tween.getValue())}`);
      }
    });

    this.time.delayedCall(5000, () => {
      this.scene.start("escena_2");
    });
  }

  lose() {
    let ui = this.scene.get("ui");
    ui.events.emit("pause");
    ui.score -= 1000;
    let rect = this.add.rectangle(0, 0, 1920, 1080, 0x000, 0.6).setOrigin(0);
    let char = this.add.image(735, 500, "caso_1", "char_lose");
    let text = this.add.image(1215, 465, "caso_1", "text_lose");
    let pts = this.add.image(1210, 735, "caso_1", "pts_lose");

    this.add.tween({
      targets: [char, text, pts],
      scale: { start: 0, to: 1 },
      duration: 500,
      ease: "Quad.easeOut",
      delay: this.tweens.stagger(100)
    });

    let total = this.add
      .text(1060, 625, "")
      .setFontFamily("MontserratBold")
      .setColor("#FF2138")
      .setFontSize(80)
      .setAlign("center");
    let tween = this.tweens.addCounter({
      from: 0,
      to: 1000,
      duration: 2000,
      ease: "Quad.easeOut",
      onUpdate: () => {
        total.setText(`- ${Math.round(tween.getValue())}`);
      }
    });

    this.time.delayedCall(5000, () => {
      this.scene.start("escena_2");
    });
  }
}
