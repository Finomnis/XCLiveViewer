import findBisect from "../FindBisect";

it("FindBisect", () => {
  expect(findBisect(55, 10, n => n * n)).toEqual(8);
  expect(findBisect(48, 10, n => n * n)).toEqual(7);
  expect(findBisect(49, 10, n => n * n)).toEqual(7);
  expect(findBisect(50, 10, n => n * n)).toEqual(8);
  expect(findBisect(63, 10, n => n * n)).toEqual(8);
  expect(findBisect(64, 10, n => n * n)).toEqual(8);
  expect(findBisect(65, 10, n => n * n)).toEqual(9);

  expect(findBisect(-1, 10, n => n * n)).toEqual(0);
  expect(findBisect(0, 10, n => n * n)).toEqual(0);
  expect(findBisect(1, 10, n => n * n)).toEqual(1);
  expect(findBisect(2, 10, n => n * n)).toEqual(2);

  expect(findBisect(80, 10, n => n * n)).toEqual(9);
  expect(findBisect(81, 10, n => n * n)).toEqual(9);
  expect(findBisect(82, 10, n => n * n)).toEqual(10);

  expect(findBisect(-1, 0, n => n * n)).toEqual(-1);
  expect(findBisect(0, 0, n => n * n)).toEqual(-1);
  expect(findBisect(1, 0, n => n * n)).toEqual(-1);

  expect(findBisect(-1, 1, n => n * n)).toEqual(0);
  expect(findBisect(0, 1, n => n * n)).toEqual(0);
  expect(findBisect(1, 1, n => n * n)).toEqual(1);
});

//0 1 4 9 16 25 36 49 64 81
