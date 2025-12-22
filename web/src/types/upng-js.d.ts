declare module 'upng-js' {
  export interface UPNG {
    encode(imgs: (ArrayBuffer | SharedArrayBuffer)[], w: number, h: number, cnum?: number, comp?: number): Uint8Array;
    decode(buffer: ArrayBuffer): {
      width: number;
      height: number;
      depth: number;
      ctype: number;
      frames: number;
      tabs: Record<string, unknown>;
      data: Uint8Array[];
    };
    toRGBA8(out: unknown): Uint8Array[];
  }

  const UPNG: UPNG;
  export default UPNG;
}
