core = {
    num: (n0, n1, n2, n3) => [
        ((n0 / n1) - n2) * n3,
        ((n0 / n1) * n2) - n3,
        ((n0 - n1) / n2) * n3,
        ((n0 - n1) * n2) / n3,
        ((n0 * n1) / n2) - n3,
        ((n0 * n1) - n2) / n3
    ].filter(
        n => (n > 0) && Number.isInteger(n)
    ).toSorted(
        (a, b) => a - b
    ).at(0),
    fromWord: function(w){
        if (w.length != 4) throw "word must be 4 characters";
        const codes = w.split('')
                       .map(chr => chr.codePointAt(0) - 96);
        return this.num(...codes);
    },
    fromWords: function (...words){
        return String.fromCodePoint(
            ...words.map(
                word => this.fromWord(word.toLowerCase()) + 96
            )
        );
    }
}