export const lerp = (val1, val2, pct) => {
  if (val2 === null) {
    return val1;
  }
  if (val1 === null) {
    return val2;
  }
  return (1.0 - pct) * val1 + pct * val2;
};

// Important:
// t0<t1<t2<t3 and t1<=t<=t2
export const spline = (p0, t0, p1, t1, p2, t2, p3, t3, t) => {
  const A1 = ((p1 - p0) * t + p0 * t1 - p1 * t0) / (t1 - t0);
  const A2 = ((p2 - p1) * t + p1 * t2 - p2 * t1) / (t2 - t1);
  const A3 = ((p3 - p2) * t + p2 * t3 - p3 * t2) / (t3 - t2);

  const B1 = ((A2 - A1) * t + A1 * t2 - A2 * t0) / (t2 - t0);
  const B2 = ((A3 - A2) * t + A2 * t3 - A3 * t1) / (t3 - t1);

  const C = ((B2 - B1) * t + B1 * t2 - B2 * t1) / (t2 - t1);

  return C;
};

export const splineDerivative = (p0, t0, p1, t1, p2, t2, p3, t3, t) => {
  const A1 = ((p1 - p0) * t + p0 * t1 - p1 * t0) / (t1 - t0);
  const A2 = ((p2 - p1) * t + p1 * t2 - p2 * t1) / (t2 - t1);
  const A3 = ((p3 - p2) * t + p2 * t3 - p3 * t2) / (t3 - t2);

  const A1d = (p1 - p0) / (t1 - t0);
  const A2d = (p2 - p1) / (t2 - t1);
  const A3d = (p3 - p2) / (t3 - t2);

  const B1 = ((A2 - A1) * t + A1 * t2 - A2 * t0) / (t2 - t0);
  const B2 = ((A3 - A2) * t + A2 * t3 - A3 * t1) / (t3 - t1);

  const B1d = (A2d * t + A2 - A1d * t - A1 + A1d * t2 - A2d * t0) / (t2 - t0);
  const B2d = (A3d * t + A3 - A2d * t - A2 + A2d * t3 - A3d * t1) / (t3 - t1);

  const Cd = (B2d * t + B2 - B1d * t - B1 + B1d * t2 - B2d * t1) / (t2 - t1);

  return Cd;
};

// Interpolates between points p1 and p2
export const uniformspline = (p0, p1, p2, p3, pct) => {
  //return 0.5*pct*pct*pct*(p3-3*p2+3*p1-p0) + 0.5*pct*pct*(2*p0-5*p1+4*p2-p3) + 0.5*pct*(p2-p0) + p1;
  return (
    pct *
      (pct *
        (pct * (p3 - 3 * p2 + 3 * p1 - p0) + 2 * p0 - 5 * p1 + 4 * p2 - p3) +
        p2 -
        p0) *
      0.5 +
    p1
  );
};

export const uniformsplineDerivative = (p0, p1, p2, p3, pct) => {
  //return 1.5*pct*pct*(p3-3*p2+3*p1-p0) + pct*(2*p0-5*p1+4*p2-p3) + 0.5*(p2-p0);
  return (
    0.5 *
    (pct *
      (3 * pct * (p3 - 3 * p2 + 3 * p1 - p0) +
        4 * p0 -
        10 * p1 +
        8 * p2 -
        2 * p3) +
      p2 -
      p0)
  );
};
