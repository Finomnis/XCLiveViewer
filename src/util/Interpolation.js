export const lerp = (val1, val2, pct) => {
  if (val2 === null) {
    return val1;
  }
  if (val1 === null) {
    return val2;
  }
  return (1.0 - pct) * val1 + pct * val2;
};

// TODO catmull-rom
