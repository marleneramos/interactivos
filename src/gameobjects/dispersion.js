export default class Dispersion extends Phaser.GameObjects.Image {
  constructor(scene, x, y, textura, frame) {
    super(scene, x, y, textura, frame);
    //  Here's the render texture for the scene

    var size = 256;
    this.rt = this.scene.make.renderTexture({
      width: size,
      height: size,
      add: false
    });

    this.noise = this.scene.make.renderTexture({
      width: size,
      height: size,
      add: false
    });

    this.burn = this.scene.make.renderTexture({
      width: size,
      height: size,
      add: false
    });

    this.scene.cache.shader.get("disolve").uniforms = {
      disolveValue: { type: "1f", value: 1.0 }
    };

    this.shader = this.scene.add
      .shader("disolve", 0, 0, size, size)
      .setRenderToTexture("Buffer" + frame, true);

    //  Feed the Render Texture glTexture into the shader as our input uniform iChannel0
    this.shader.setSampler2DBuffer(
      "iChannel0",
      this.rt.glTexture,
      size,
      size,
      0
    );

    this.shader.setSampler2DBuffer(
      "iChannel1",
      this.noise.glTexture,
      size,
      size,
      0
    );

    this.shader.setSampler2DBuffer(
      "iChannel2",
      this.burn.glTexture,
      size,
      size,
      0
    );

    this.rt.draw(this, size / 2, size / 2);
    this.noise.drawFrame("effects", "Noise4", 0, 0);
    this.burn.drawFrame("effects", "burngradient", 0, 0);

    this.counter = this.scene.tweens.addCounter({
      from: 1,
      to: 0,
      duration: 2500,
      ease: "Quad.easeOut",
      onUpdate: () => {
        this.shader.setUniform("disolveValue.value", this.counter.getValue());
      },
      onComplete: () => {
        this.emit("completed");
      }
    });

    //  This image just holds the output of the Shader so we can see it on-screen
    this.scene.add.image(x, y, "Buffer" + frame).setOrigin(0);
  }
}
