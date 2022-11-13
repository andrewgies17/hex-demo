import _ from "lodash";
import "reset-css";
import { lines, points, polyPoints, squarePoints } from "./drawing";
import "./styles.css";
import {
  context,
  dieRoll,
  getCanvas,
  lerp,
  Point,
  rescale,
  sequentialize,
} from "./util";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

export const RENDER_RES = 4;

const setupCanvas = () => {
  const canvas = getCanvas();
  canvas.style.width = `${CANVAS_WIDTH}px`;
  canvas.style.height = `${CANVAS_HEIGHT}px`;
  canvas.width = CANVAS_WIDTH * RENDER_RES;
  canvas.height = CANVAS_HEIGHT * RENDER_RES;
};

type RenderOptions = {
  nPoly: number;
  showPolygon: boolean;
  ratio: number;
  fractalDepth: number;
};

const DEFAULT_OPTS: RenderOptions = Object.freeze({
  nPoly: 6,
  showPolygon: true,
  ratio: 2 / 3,
  fractalDepth: 10_000,
});

const render = (opts: Readonly<RenderOptions>) => {
  const ctx = context();
  ctx.clearRect(0, 0, rescale(CANVAS_WIDTH), rescale(CANVAS_HEIGHT));

  // Base Poly
  const poly = polyPoints(
    { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 },
    (CANVAS_WIDTH - 100) / 2,
    opts.nPoly
  );
  points(poly, { weight: 3 });
  if (opts.showPolygon) {
    lines(sequentialize(poly));
  }

  // Generate Fractal
  const fractal: Point[] = [];
  for (let i = 0; i < opts.fractalDepth; i++) {
    const prev = _.last(fractal) ?? poly[0];
    const target = poly[dieRoll(opts.nPoly) - 1];
    fractal.push(lerp(prev, target, opts.ratio));
  }

  console.log(fractal);

  // Draw Fractal
  squarePoints(fractal, { weight: 2 });
};

let latestOptions = DEFAULT_OPTS;
const scheduleRender = (options: RenderOptions) => {
  latestOptions = options;
  requestAnimationFrame(() => {
    render(_.cloneDeep(latestOptions));
  });
};

const generateControls = () => {
  const container = document.getElementById("options-container")!;
  let options = _.cloneDeep(DEFAULT_OPTS);

  const generateRange = ({
    key,
    label,
    min,
    max,
    step = 1,
  }: {
    key: keyof RenderOptions;
    label: string;
    min: number;
    max: number;
    step?: number;
  }) => {
    const startingValue: any = options[key];
    const row = document.createElement("div");
    row.classList.add("opt-row");

    const labelElt = document.createElement("label");
    labelElt.innerHTML = label;
    const rangeElt = document.createElement("input");
    rangeElt.type = "range";
    rangeElt.min = String(min);
    rangeElt.max = String(max);
    rangeElt.step = String(step);
    rangeElt.value = String(startingValue);
    rangeElt.classList.add("opt-row-fill");
    const boxElt = document.createElement("input");
    boxElt.type = "number";
    boxElt.min = String(min);
    boxElt.max = String(max);
    boxElt.step = String(step);
    boxElt.value = String(startingValue);

    row.appendChild(labelElt);
    row.appendChild(rangeElt);
    row.appendChild(boxElt);

    container.appendChild(row);

    const handleInput = (event: any) => {
      const val = Number(event.target.value);
      rangeElt.value = String(val);
      boxElt.value = String(val);
      // @ts-ignore
      options[key] = val;
      scheduleRender(options);
    };

    rangeElt.addEventListener("input", handleInput);
    boxElt.addEventListener("input", handleInput);
  };

  const createOptions = () => {
    generateRange({
      key: "nPoly",
      label: "Poly Sides",
      min: 3,
      max: 10,
    });

    generateRange({
      key: "fractalDepth",
      label: "Fractal Depth",
      min: 10,
      max: 20_000,
    });

    generateRange({
      key: "ratio",
      label: "Step Ratio",
      min: 0,
      max: 1,
      step: 0.01,
    });

    const resetButton = document.createElement("button");
    resetButton.innerHTML = "Reset";
    resetButton.style.margin = "20px auto 0";
    resetButton.onclick = () => {
      container.innerHTML = "";
      createOptions();
      options = _.cloneDeep(DEFAULT_OPTS);
      scheduleRender(options);
    };
    container.appendChild(resetButton);
  };

  createOptions();
  scheduleRender(options);
};

setupCanvas();
generateControls();
