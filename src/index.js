"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Perf
 */
var fc = __importStar(require("fast-check"));
var loremIpsum = fc.record({
    text: fc.lorem(100),
    type: fc.constant('x'),
    attrs: fc.constant({}),
    markup: fc.option(fc.array(fc.record({
        type: fc.oneof(fc.constant('b'), fc.constant('i'), fc.constant('u')),
        start: fc.nat(1),
        end: fc.nat(100),
    }), 1, 10)),
});
var section = function (n) {
    return fc.record({
        heading: loremIpsum,
        children: fc.array(n > 0 ? fc.oneof(loremIpsum, loremIpsum, loremIpsum, section(n - 1)) : loremIpsum, 10),
    });
};
var counter = 0;
console.time('perf');
try {
    fc.assert(fc.property(section(10), function (s) {
        ++counter;
        return s.children.length >= 0;
        //return !(s.children.length === 4 && s.children[0].text == null);
    }), {
        seed: 1531485347737,
        numRuns: 2000,
    });
}
finally {
    console.timeEnd('perf');
    console.log('Asertion count:', counter);
}
