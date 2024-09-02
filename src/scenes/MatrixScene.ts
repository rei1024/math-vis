import { Scene } from "phaser";
import { Grid, mathToWorldView } from "../lib/ui/Grid";
import { PointObject, toArray } from "../lib/ui/PointObject";
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

  private text!: Phaser.GameObjects.Text;

  private rect!: Phaser.GameObjects.Graphics;
  constructor() {
    super("MatrixScene");
  }

  create() {
    console.log("start MatrixScene");

    this.text = this.add.text(-300, -300, "Test", {
      color: "#000000",
      fontSize: "64px",
    });
    this.text.setOrigin(0.5, 0.5);
    this.text.scale = 0.5;

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
      { color: Color.SLATE_300 }
    );

    this.rect = this.add.graphics();

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

    const matrix = this.getMatrix();
    const pointInput = this.pointInput.getPosition();
    this.pointOutput.setPosition(pointInput.transformMat3(matrix));

    {
      const rect = this.rect;
      rect.clear();
      rect.beginPath();
      rect.moveTo(0, 0); // 最初の点に移動
      rect.lineTo(...toArray(mathToWorldView(this.point1.getPosition())));
      const diagPoint = mathToWorldView(
        this.point1.getPosition().add(this.point2.getPosition())
      );
      rect.lineTo(...toArray(diagPoint));
      rect.lineTo(...toArray(mathToWorldView(this.point2.getPosition())));
      rect.lineTo(0, 0);
      rect.closePath(); // 最初の点に戻り、形を閉じる

      // 四角形を塗りつぶす場合は次の行を追加
      rect.fillStyle(0xff0000, 0.3); // 塗りつぶしの色と透明度を設定
      rect.fillPath(); // 四角形を塗りつぶす

      // 0 1 2
      // 3 4 5
      // 6 7 8
    }

    function f(v: number): string {
      return v.toFixed(2).padStart(5, " ");
    }

    this.text.text =
      `⎧${f(matrix.val[0])} ${f(matrix.val[1])}⎫` +
      "\n" +
      `⎩${f(matrix.val[3])} ${f(matrix.val[4])}⎭`;
  }

  private getMatrix() {
    const matrix = new Phaser.Math.Matrix3();
    const point1Pos = this.point1.getPosition();
    const point2Pos = this.point2.getPosition();

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
    return matrix;
  }
}
