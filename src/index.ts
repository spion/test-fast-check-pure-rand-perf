/**
 * Perf
 */
import * as fc from 'fast-check';

import { Arbitrary } from 'fast-check';

let loremIpsum = fc.record({
  text: fc.lorem(100),
  type: fc.constant('x'),
  attrs: fc.constant({}),
  markup: fc.option(
    fc.array(
      fc.record({
        type: fc.oneof(fc.constant('b'), fc.constant('i'), fc.constant('u')),
        start: fc.nat(1),
        end: fc.nat(100), // we can normalize it later
      }),
      1,
      10,
    ),
  ),
});

let section = (n: number): Arbitrary<{ heading: any; children: any[] }> =>
  fc.record({
    heading: loremIpsum,
    children: fc.array(
      n > 0 ? fc.oneof(loremIpsum, loremIpsum, loremIpsum, section(n - 1) as any) : loremIpsum,
      10,
    ),
  });

let counter = 0;
console.time('perf')
try {
  fc.assert(
    fc.property(section(10), s => {
      ++counter;
      return s.children.length >= 0;
      //return !(s.children.length === 4 && s.children[0].text == null);
    }),
    {
      seed: 1531485347737,
      numRuns: 2000,
    },
  );
} finally {
  console.timeEnd('perf')
  console.log('Asertion count:', counter);
}
