import { Scene } from "phaser";

export class InitScene extends Scene {
  constructor() {
    super("InitScene");
  }

  create() {
    const matrix = this.add.text(500, 400, "Matrix", {
      color: "#000000",
      fontSize: "64px",
    });
    matrix.setInteractive({ useHandCursor: true });
    matrix.once("pointerdown", () => {
      this.scene.start("MatrixScene");
    });
  }
}
