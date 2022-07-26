import TextScramble from "./gameobjects/textScramble";

export default class escena extends Phaser.Scene {
  constructor(config) {
    super({
      key: "boot",
      pack: {
        files: [
          {
            type: "image",
            key: "code",
            url: require("./assets/code_endless_bg.png")
          },
          {
            type: "image",
            key: "loader",
            url: require("./assets/loading.png")
          }
        ]
      }
    });
  }

  preload() {
    const phrases = [
      "Cargando...",
      "Inicializando simulación...",
      "Preparando metadatos...",
      "Desencriptando materia..."
    ];

    let code = this.add
      .image(0, -this.cameras.main.height, "code")
      .setOrigin(0);

    let loader = this.add.image(1700, 900, "loader");

    this.add.tween({
      targets: loader,
      angle: 359,
      repeat: -1,
      duration: 3000,
      ease: "linear"
    });

    this.add.tween({
      targets: code,
      y: this.cameras.main.height,
      duration: 10000,
      ease: "linear",
      repeat: -1
    });

    var cargando = this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height / 2,
        "Inicializando simulación..."
      )
      .setDepth(1)
      .setAlign("center")
      .setOrigin(0.5, 0.6)
      .setFontSize(30)
      .setFontFamily("Montserrat");
    const fx = new TextScramble(cargando);

    var timer;

    this.load.once(Phaser.Loader.Events.COMPLETE, () => {
      code.destroy();
      loader.destroy();
      cargando.destroy();
      timer && timer.destroy();
      fx.stopped = true;
    });

    let counter = 0;
    const next = () => {
      fx.setText(phrases[counter]).then(() => {
        timer = this.time.delayedCall(800, next);
      });
      counter = (counter + 1) % phrases.length;
    };

    next();
    // require("./assets/caso_1-0.png"),
    //   require("./assets/caso_1-1.png"),
    //   this.load.multiatlas("caso_1", require("./assets/caso_1.json"));

      // this.load.image("cuad1",require("./assets/recu1.png"));
      // this.load.image("cuad2",require("./assets/recu2.png"));
      this.load.image("spark0",require("./assets/blue.png"));
      this.load.image("spark1",require("./assets/red.png"));

    // require("./assets/caso_2-0.png"),
    //   require("./assets/caso_2-1.png"),
    //   this.load.multiatlas("caso_2", require("./assets/caso_2.json"));

      require("./assets/clase1.png"),
      this.load.multiatlas("clase1", require("./assets/clase1.json"));
    // this.load.atlas(
    //   "effects",
    //   require("./assets/effects.png"),
    //   require("./assets/effects.json")
    // );
    this.load.glsl("disolve", require("./shaders/disolve.glsl"));
    this.load.audio("inicio", require("./audio/inicio.mp3"));
    this.load.audio("correct", require("./audio/correct.mp3"));
    this.load.audio("error", require("./audio/error.mp3"));
    this.load.audio("win", require("./audio/win.mp3"));

    this.load.audio("a1", require("./audio/brother.mp3"));
    this.load.audio("a2", require("./audio/dad.mp3"));
    this.load.audio("a3", require("./audio/grandma.mp3"));
    this.load.audio("a4", require("./audio/grandpa.mp3"));
    this.load.audio("a5", require("./audio/mom.mp3"));
    this.load.audio("a6", require("./audio/sister.mp3"));
  }

  create() {
    this.time.delayedCall(1500, () => {
      this.scene.start("escena_2");
    });
  }
}
