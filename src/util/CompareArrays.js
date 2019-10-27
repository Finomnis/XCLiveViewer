// attach the .equals method to Array's prototype to call it on any array
export function arraysEqual(array1, array2) {
  // if the other array is a falsy value, return
  if (!array1 || !array2) return false;

  // compare lengths - can save a lot of time
  if (array1.length !== array2.length) return false;

  for (var i = 0, l = array1.length; i < l; i++) {
    /*// Check if we have nested arrays
    if (array1[i] instanceof Array && array2[i] instanceof Array) {
      // recurse into the nested arrays
      if (!array1[i].equals(array2[i])) return false;
    } else */
    if (array1[i] !== array2[i]) {
      return false;
    }
  }
  return true;
}
