// this software includes the work that is distributed in the apache license 2.0
// https://www.apache.org/licenses/LICENSE-2.0
// https://github.com/GoogleChromeLabs/squoosh/blob/db1a5138e69b222cbb5c310a2f2659c3900ebab1/src/client/lazy-app/Compress/Output/custom-els/PinchZoom/index.ts

/**
 * これを現在のスケールに掛ける
 */
export function calcScaleDiff(event: WheelEvent): number {
  let { deltaY } = event;
  const { ctrlKey, deltaMode } = event;

  if (deltaMode === 1) {
    // 1 is "lines", 0 is "pixels"
    // Firefox uses "lines" for some types of mouse
    deltaY *= 15;
  }

  const zoomingOut = deltaY > 0;

  // ctrlKey is true when pinch-zooming on a trackpad.
  const divisor = ctrlKey ? 100 : 300;
  // when zooming out, invert the delta and the ratio to keep zoom stable
  const ratio = 1 - (zoomingOut ? -deltaY : deltaY) / divisor;
  const scaleDiff = zoomingOut ? 1 / ratio : ratio;

  return scaleDiff;
}
