import { Scene } from "phaser";
import { WORLD_MATH_RATIO } from "../constant";

/**
 * phaserの座標系から数学の座標に変換
 */
export function worldViewToMath({
  x,
  y,
}: {
  x: number;
  y: number;
}): Phaser.Math.Vector2 {
  return new Phaser.Math.Vector2(x / WORLD_MATH_RATIO, -y / WORLD_MATH_RATIO);
}

/**
 * 数学の座標からphaserの座標に変換
 */
export function mathToWorldView({
  x,
  y,
}: {
  x: number;
  y: number;
}): Phaser.Math.Vector2 {
  return new Phaser.Math.Vector2(x * WORLD_MATH_RATIO, -y * WORLD_MATH_RATIO);
}

export class Grid {
  container!: Phaser.GameObjects.Container;
  constructor(private scene: Scene) {}

  create() {
    this.container = this.scene.add.container(0, 0);
  }

  update() {
    this.container.destroy();
    this.container = this.scene.add.container(0, 0);
    const camera = this.scene.cameras.main;
    const view = camera.worldView;

    const LEVEL_BASE = 5;
    const LEVEL = Math.floor(
      Math.log(view.width / 1080) / Math.log(LEVEL_BASE)
    );

    const UNIT = LEVEL_BASE ** LEVEL * WORLD_MATH_RATIO;
    const STROKE_WIDTH = (UNIT / 100) * 5;
    const FONT_SIZE = 64;
    const COLOR = 0xeeeeee;
    const OFFSET = view.width / 2;
    // 縦向き
    for (let i = 0; i <= Math.ceil(view.width / UNIT); i++) {
      const xNum = Math.floor(view.left / UNIT) + i;
      const x = xNum * UNIT;
      const rect = this.scene.add
        .rectangle(
          x,
          view.top - OFFSET,
          STROKE_WIDTH,
          view.height + OFFSET,
          COLOR
        )
        .setOrigin(0.5, 0);
      this.container.add(rect);

      // TODO: 手前に持ってくる
      const t = this.scene.add.text(
        x,
        0,
        `${toNumber(xNum * LEVEL_BASE ** LEVEL, LEVEL)}`,
        {
          color: "#000000",
          fontSize: `${FONT_SIZE}px`,
        }
      );
      // fontSizeは変更すると画質が変化するのでscaleで変更
      t.scale = LEVEL_BASE ** LEVEL / 2;
      this.container.add(t);
    }

    // 横向き
    for (let j = 0; j <= Math.ceil(view.height / UNIT); j++) {
      const yNum = Math.floor(view.top / UNIT) + j;
      const y = yNum * UNIT;
      const rect = this.scene.add
        .rectangle(
          view.left - OFFSET,
          y,
          view.width + OFFSET,
          STROKE_WIDTH,
          COLOR
        )
        .setOrigin(0, 0.5);
      this.container.add(rect);

      if (yNum !== 0) {
        const t = this.scene.add.text(
          0,
          y,
          `${-toNumber(yNum * LEVEL_BASE ** LEVEL, LEVEL)}`,
          {
            color: "#000000",
            fontSize: `${FONT_SIZE}px`,
          }
        );
        this.container.add(t);
        t.scale = LEVEL_BASE ** LEVEL / 2;
      }
    }

    this.container.setDepth(-1);
    // 数字 重い
    // for (let i = 0; i <= Math.ceil(view.width / UNIT); i++) {
    //   const xNum = Math.floor(view.left / UNIT) + i;
    //   const x = xNum * UNIT;
    //   for (let j = 0; j <= Math.ceil(view.height / UNIT); j++) {
    //     const yNum = Math.floor(view.top / UNIT) + j;
    //     const y = yNum * UNIT;
    //     const t = this.scene.add.text(x, y, `${xNum}, ${yNum}`, {
    //       color: "#000000",
    //     });
    //     this.container.add(t);
    //   }
    // }
  }
}
function toNumber(value: number, level: number) {
  const fixed = -level;
  if (fixed < 0) {
    return value.toString();
  }
  if (fixed >= 20) {
    return value.toString();
  }
  return value.toFixed(fixed);
}
