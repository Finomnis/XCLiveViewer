const findBisect = (targetValue, length, dataFn) => {
  if (length < 1) return 0;

  let minIndex = -1;
  let maxIndex = length;
  let currentIndex = 0;
  let currentValue = null;

  while (minIndex < maxIndex - 1) {
    currentIndex = ((minIndex + maxIndex) / 2) | 0;
    currentValue = dataFn(currentIndex);

    if (currentValue < targetValue) {
      minIndex = currentIndex;
    } else {
      maxIndex = currentIndex;
    }
  }

  return maxIndex;
};

export default findBisect;
