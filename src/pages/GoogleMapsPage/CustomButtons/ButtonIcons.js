export const createButtonIcon = svgPath => {
  const xmlns = "http://www.w3.org/2000/svg";

  let svgEl = document.createElementNS(xmlns, "svg");
  svgEl.setAttribute("width", "24");
  svgEl.setAttribute("height", "24");
  svgEl.setAttribute("viewBox", "0 0 24 24");

  let pathEl = document.createElementNS(xmlns, "path");
  pathEl.setAttribute("d", svgPath);

  svgEl.appendChild(pathEl);
  return svgEl;
};

export const createSatelliteIcon = () =>
  createButtonIcon(
    "M8.57 6H6v2.58c1.42 0 2.57-1.16 2.57-2.58zM12 6h-1.71c0 2.36-1.92 4.29-4.29 4.29V12c3.32 0 6-2.69 6-6zm2.14 5.86l-3 3.87L9 13.15 6 17h12z"
  );
