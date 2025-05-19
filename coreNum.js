const algorithms = {
  /*  Do the operations as specified, accepting floating
    point errors which seem to be consistent with
    puzzle design */
  naive: (a, b, c, d) => [
    (a / b - c) * d, // +a/b-c*d
    (a / b) * c - d, // +a/b*c-d
    ((a - b) / c) * d, // +a-b/c*d
    ((a - b) * c) / d, // +a-b*c/d
    (a * b) / c - d, // +a*b/c-d
    (a * b - c) / d, // +a*b-c/d
  ],
  /*  Refactor operations such that any division is as
    late as possible to avoid compounding inaccuracies -
    this should generally avoid integer results not
    appearing as integers */
  float_safe: (a, b, c, d) => [
    // The first case is messy because addition and
    // subtraction are not commutative with multiplication
    (a * d) / b - c * d,
    (a * c) / b - d, // commutative => clean
    ((a - b) * d) / c, // commutative => clean
    ((a - b) * c) / d, // no change needed
    (a * b) / c - d, // commutative => clean
    (a * b - c) / d, // no change needed
  ],
  no_intermediate_floats: function (a, b, c, d) {
    // This one is an arse to do any other way
    const div = (x, y) => x / y
    const sub = (x, y) => x - y
    const mul = (x, y) => x * y
    return [
      [div, sub, mul],
      [div, mul, sub],
      [sub, div, mul],
      [sub, mul, div],
      [mul, div, sub],
      [mul, sub, div],
    ].flatMap(function ([oa, ob, oc]) {
      const ab = oa(a, b)
      if (Number.isInteger(ab)) {
        const abc = ob(ab, c)
        if (Number.isInteger(abc)) return [oc(abc, d)]
      }
      return []
    })
  },
}
const default_alg = algorithms.naive

const core = {
  num: ([a, b, c, d], alg = default_alg) =>
    alg(a, b, c, d)
      .filter((n) => n > 0 && Number.isInteger(n))
      .toSorted((a, b) => a - b)
      .at(0),
  fromWord: function (w, alg = default_alg) {
    if (w.length != 4) throw "word must be 4 characters"
    return this.num(
      w.split("").map((chr) => chr.codePointAt(0) - 96),
      alg,
    )
  },
  fromWords: function (words, alg = default_alg) {
    return String.fromCodePoint(
      ...words.map((word) => this.fromWord(word.toLowerCase(), alg) + 96),
    )
  },
}