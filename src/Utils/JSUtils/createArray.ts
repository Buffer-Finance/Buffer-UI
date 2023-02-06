const createArray: (n: number) => number[] = (n) => Array.apply(0, new Array(n)).map((i, idx) => idx)

export { createArray }
