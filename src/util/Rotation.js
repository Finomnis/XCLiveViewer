export const getRotationStyle = bearing => {
  const transform = "rotate(" + bearing.toString() + "deg)";

  const rotationStyle = {
    transform: transform,

    /* Safari */
    WebkitTransform: transform,

    /* Firefox */
    MozTransform: transform,

    /* IE */
    msTransform: transform,

    /* Opera */
    OTransform: transform
  };
  return rotationStyle;
};
