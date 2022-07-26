export default class ui extends Phaser.Scene {
  constructor(config) {
    super("ui");
  }

  init(data) {}

  create() {
    this.add.image(1585, 110, "caso_1", "reloj");

    this.score = 0;

    let pause = this.add.image(1720, 110, "caso_1", "pausa");
    let pauseScreen = this.add
      .image(0, 0, "caso_2", "fondoPausa")
      .setVisible(false)
      .setOrigin(0);

    this.restante = this.add
      .text(1575, 105)
      .setFontSize(30)
      .setColor("rgba(87,173,49,1)")
      .setFontFamily("MontserratBold")
      .setDepth(9990)
      .setOrigin(0.5);

    var callback = () => {
      let scenes = this.scene.manager.getScenes(true);
      for (const scene of scenes) {
        if (scene.lose) {
          scene.lose();
        }
      }
      this.timer = this.time.delayedCall(120 * 1000, callback);
      this.timer.paused = true;
    };
    this.timer = this.time.delayedCall(120 * 1000, callback);

    this.events.on("pause", () => {
      this.timer.paused = true;
    });
    this.events.on("resume", () => {
      this.timer.paused = false;
    });

    pause.setInteractive({ useHandCursor: true });
    pause.on("pointerdown", () => {
      this.timer.paused = !this.timer.paused;
      pauseScreen.setVisible(this.timer.paused);
    });
  }

  update(time, delta) {
    if (!this.timer.hasDispatched) {
      this.restante.setText(
        this.formatTime(
          Math.round((this.timer.delay - this.timer.elapsed) / 1000)
        )
      );
    }
  }

  formatTime(s) {
    // Convert seconds (s) to a nicely formatted and padded time string
    var minutes = "0" + Math.floor(s / 60);
    var seconds = "0" + (s - minutes * 60);
    return minutes.substr(-2) + ":" + seconds.substr(-2);
  }
}
