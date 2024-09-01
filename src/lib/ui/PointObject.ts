import { Scene } from "phaser";
import { mathToWorldView, worldViewToMath } from "./Grid";
import { hex } from "../hex";

export class PointObject {
  private circle: Phaser.GameObjects.Arc;
  private isDown = false;
  constructor(
    scene: Scene,
    mathPoint: { x: number; y: number },
    {
      draggable,
      color,
    }: {
      draggable?: boolean;
      color: string;
    }
  ) {
    const { x, y } = mathToWorldView(mathPoint);
    const circle = scene.add.circle(x, y, 20, hex(color));
    if (draggable) {
      circle.setInteractive();
      circle.on("pointerdown", () => {
        console.log("down");
        this.isDown = true;
      });
      scene.input.on("pointerup", () => {
        this.isDown = false;
      });
      scene.input.on("pointermove", (pointer: any) => {
        if (this.isDown) {
          console.log("move");
          const worldPoint = scene.cameras.main.getWorldPoint(
            pointer.x,
            pointer.y
          );
          circle.x = worldPoint.x;
          circle.y = worldPoint.y;
        }
      });
    }
    this.circle = circle;
  }

  setPosition(math: { x: number; y: number }) {
    const { x, y } = mathToWorldView(math);
    this.circle.x = x;
    this.circle.y = y;
  }

  getPosition() {
    const v = { x: this.circle.x, y: this.circle.y };
    return worldViewToMath(v);
  }

  getIsDown() {
    return this.isDown;
  }
}
