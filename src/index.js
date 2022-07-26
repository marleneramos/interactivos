import Phaser from "phaser";
import boot from "./boot";
// import escena_1 from "./escena_1";
import escena_2 from "./escena_2";
// import ui from "./ui";
import fonts from "./fonts/style.css";
const config = {
  type: Phaser.CANVAS,
  parent: "phaser-example",
  width: 1920,
  height: 1080,
  backgroundColor: "#ffffff",
  antialias: true,
  scene: [boot, escena_2],
  scale: {
    mode: Phaser.Scale.ScaleModes.FIT,
    autoCenter: Phaser.Scale.Center.CENTER_BOTH
  }
};

const game = new Phaser.Game(config);
