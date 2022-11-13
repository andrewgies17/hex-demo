import { RENDER_RES } from "./main";

export const getCanvas = () => {
  return document.getElementById("canvas")! as HTMLCanvasElement;
};

export const context = () => {
  return getCanvas().getContext("2d")!;
};

export type Point = { x: number; y: number };
export const rescale = <T extends number | Point>(value: T): T => {
  if (typeof value === "number") {
    return (value * RENDER_RES) as T;
  } else {
    return {
      x: value.x * RENDER_RES,
      y: value.y * RENDER_RES,
    } as T;
  }
};

type UnboxedPoint<S extends string> = {
  [K in `${S}X` | `${S}Y`]: number;
};
export const unbox = <S extends string>(
  { x, y }: Point,
  s: S
): UnboxedPoint<S> => {
  const p: UnboxedPoint<S> = {} as any;
  p[`${s}X`] = x;
  p[`${s}Y`] = y;
  return p;
};

export type Seq = [Point, Point][];

export const sequentialize = (
  points: Point[],
  { wrap = true }: { wrap?: boolean } = {}
): Seq => {
  if (points.length < 2) {
    return [];
  }
  const outPoints: Seq = [];
  for (let i = 0; i < points.length - 1; i++) {
    outPoints.push([points[i], points[i + 1]]);
  }
  if (wrap) {
    outPoints.push([points[points.length - 1], points[0]]);
  }
  return outPoints;
};

export const nLerp = (a: number, b: number, ratio: number) => {
  if (ratio < 0 || ratio > 1) throw "invalid lerp";
  return (b - a) * ratio + a;
};

export const lerp = (a: Point, b: Point, ratio: number) => {
  return {
    x: nLerp(a.x, b.x, ratio),
    y: nLerp(a.y, b.y, ratio),
  };
};

export const dieRoll = (dieSize: number) => {
  return Math.floor(Math.random() * dieSize) + 1;
};
