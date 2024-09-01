import { Scene } from "phaser";
import { Grid } from "../lib/ui/Grid";
import { PointObject } from "../lib/ui/PointObject";
import { setupPanZoom } from "../lib/pan-zoom";
import { Color } from "../lib/color";

/**
 * 行列による線形変換
 */
export class MatrixScene extends Scene {
  private grid = new Grid(this);

  private point1!: PointObject;
  private point2!: PointObject;
  private pointInput!: PointObject;
  private pointOutput!: PointObject;
  constructor() {
    super("MatrixScene");
  }

  create() {
    console.log("start MatrixScene");

    this.grid.create();
    this.point1 = new PointObject(
      this,
      { x: 1, y: 0 },
      { draggable: true, color: Color.CYAN_200 }
    );
    this.point2 = new PointObject(
      this,
      { x: 0, y: 1 },
      { draggable: true, color: Color.CYAN_200 }
    );
    this.pointInput = new PointObject(
      this,
      { x: 1, y: 1 },
      { draggable: true, color: Color.RED_200 }
    );

    this.pointOutput = new PointObject(
      this,
      { x: 1, y: 1 },
      { color: Color.SLATE_500 }
    );

    // カメラの設定
    const camera = this.cameras.main;

    camera.scrollX = -1920 / 2;
    camera.scrollY = -1080 / 2;

    setupPanZoom(this, {
      isPanDisabled: () => {
        return (
          this.point1.getIsDown() ||
          this.point2.getIsDown() ||
          this.pointInput.getIsDown()
        );
      },
    });
  }

  update(time: number, delta: number): void {
    this.grid.update();

    const matrix = new Phaser.Math.Matrix3();
    matrix.identity();
    const point1Pos = this.point1.getPosition();
    const point2Pos = this.point2.getPosition();
    const point3Pos = this.pointInput.getPosition();

    matrix.fromArray([
      // x
      point1Pos.x,
      point1Pos.y,
      0,
      // y
      point2Pos.x,
      point2Pos.y,
      0,
      // z
      0,
      0,
      1,
    ]);
    this.pointOutput.setPosition(point3Pos.transformMat3(matrix));
  }
}
