export const createButtonIcon = (svgPath, viewBox) => {
  const xmlns = "http://www.w3.org/2000/svg";

  let svgEl = document.createElementNS(xmlns, "svg");
  svgEl.setAttribute("width", "24");
  svgEl.setAttribute("height", "24");
  svgEl.setAttribute("viewBox", viewBox);

  let pathEl = document.createElementNS(xmlns, "path");
  pathEl.setAttribute("d", svgPath);

  svgEl.appendChild(pathEl);
  return svgEl;
};

export const createSatelliteIcon = () =>
  createButtonIcon(
    "M8.57 6H6v2.58c1.42 0 2.57-1.16 2.57-2.58zM12 6h-1.71c0 2.36-1.92 4.29-4.29 4.29V12c3.32 0 6-2.69 6-6zm2.14 5.86l-3 3.87L9 13.15 6 17h12z",
    "0 0 24 24"
  );

export const createFocusCameraIcon = () =>
  createButtonIcon(
    "M10 30h-4v8c0 2.21 1.79 4 4 4h8v-4h-8v-8zm0-20h8v-4h-8c-2.21 0-4 1.79-4 4v8h4v-8zm28-4h-8v4h8v8h4v-8c0-2.21-1.79-4-4-4zm0 32h-8v4h8c2.21 0 4-1.79 4-4v-8h-4v8zm-14-22c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z",
    "-10 -10 68 68"
  );
