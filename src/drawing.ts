import { context, Point, rescale, Seq, unbox } from "./util";

export const polyPoints = (center: Point, radius: number, n: number) => {
  const { centerX, centerY } = unbox(center, "center");
  const points = [];
  for (let p = 0; p < n; p++) {
    const angleDeg = (360 / n) * p - 90;
    const angleRad = (angleDeg / 180) * Math.PI;
    const x = centerX + Math.cos(angleRad) * radius;
    const y = centerY + Math.sin(angleRad) * radius;
    points.push({ x, y });
  }
  return points;
};

type PointOptions = { weight?: number };
export const point = (point: Point, { weight = 2 }: PointOptions = {}) => {
  const { x, y } = rescale(point);
  const ctx = context();
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(x, y, rescale(weight), 0, 360);
  ctx.fill();
};

export const points = (points: Point[], options?: PointOptions) => {
  points.forEach((pt) => point(pt, options));
};

export const squarePoint = (
  point: Point,
  { weight = 2 }: PointOptions = {}
) => {
  const { x, y } = rescale(point);
  const w = rescale(weight);
  const ctx = context();
  ctx.fillStyle = "black";
  ctx.fillRect(x, y, w, w);
};

export const squarePoints = (points: Point[], options?: PointOptions) => {
  points.forEach((pt) => squarePoint(pt, options));
};

type LineOptions = { weight?: number };
export const line = (a: Point, b: Point, { weight = 3 }: LineOptions = {}) => {
  const ctx = context();
  ctx.strokeStyle = "black";
  ctx.lineWidth = weight;
  ctx.beginPath();
  const { aX, aY } = unbox(rescale(a), "a");
  const { bX, bY } = unbox(rescale(b), "b");
  ctx.moveTo(aX, aY);
  ctx.lineTo(bX, bY);
  ctx.stroke();
};

export const lines = (lines: Seq, options?: LineOptions) => {
  lines.forEach(([a, b]) => line(a, b, options));
};
