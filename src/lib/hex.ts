export function hex(str: string): number {
  return Phaser.Display.Color.HexStringToColor(str).color;
}
