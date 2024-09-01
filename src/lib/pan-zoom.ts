import { Scene } from "phaser";
import { calcScaleDiff } from "./calcScaleDiff";

/**
 * ドラッグによるパンとホイールによるズーム操作
 */
export function setupPanZoom(
  scene: Scene,
  { isPanDisabled }: { isPanDisabled: () => boolean }
) {
  const camera = scene.cameras.main;
  // ドラッグでのパン操作を有効化
  scene.input.on("pointermove", function (pointer: any) {
    if (isPanDisabled()) {
      return;
    }
    if (pointer.isDown) {
      camera.scrollX -= (pointer.x - pointer.prevPosition.x) / camera.zoom;
      camera.scrollY -= (pointer.y - pointer.prevPosition.y) / camera.zoom;
    }
  });

  // マウスホイールでのズーム操作を有効化
  // https://github.com/phaserjs/examples/blob/8fe342bbf3669774ca804a25cc93c7efb6c03e23/public/src/tilemap/mouse%20wheel%20zoom.js
  scene.input.on(
    "wheel",
    function (pointer: { x: number; y: number; event: WheelEvent }) {
      // ズーム前のマウス位置を取得
      const worldPoint = camera.getWorldPoint(pointer.x, pointer.y);

      camera.zoom *= calcScaleDiff(pointer.event);

      // Update camera matrix, so `getWorldPoint` returns zoom-adjusted coordinates.
      // @ts-ignore
      if (camera.preRender != null) {
        // @ts-ignore
        camera.preRender();
      }

      // ズーム後のマウス位置を取得
      const newWorldPoint = camera.getWorldPoint(pointer.x, pointer.y);

      // カメラのスクロール位置を調整
      camera.scrollX += worldPoint.x - newWorldPoint.x;
      camera.scrollY += worldPoint.y - newWorldPoint.y;
    }
  );
}
