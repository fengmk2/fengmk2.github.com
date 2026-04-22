# Javascript benchmarks

## Cycles

```bash
for (var i = 0; i < l; i++) x 5,127,763 ops/sec ±0.56% (92 runs sampled)
for (var i = l; i--;) x 4,079,602 ops/sec ±3.47% (87 runs sampled)
while (i++ < l) x 4,236,812 ops/sec ±0.46% (92 runs sampled)
while (i--) x 4,219,540 ops/sec ±0.52% (92 runs sampled)
Array.forEach() x 447,358 ops/sec ±0.78% (90 runs sampled)
Fastest is for (var i = 0; i < l; i++)
```

## String trim()

```bash
trim0() x 42,355 ops/sec ±4.61% (80 runs sampled)
trim1() x 3,328 ops/sec ±1.12% (92 runs sampled)
trim2() x 3,366 ops/sec ±0.68% (91 runs sampled)
trim3() x 1,725 ops/sec ±3.23% (81 runs sampled)
trim4() x 3,469 ops/sec ±1.38% (91 runs sampled)
trim5() x 3,205 ops/sec ±4.25% (87 runs sampled)
trim6() x 3,203 ops/sec ±1.54% (91 runs sampled)
trim7() x 3,458 ops/sec ±0.53% (93 runs sampled)
trim8() x 4,992 ops/sec ±0.66% (94 runs sampled)
trim9() x 1,936 ops/sec ±3.09% (90 runs sampled)
trim10() x 20,873 ops/sec ±0.75% (77 runs sampled)
trim11() x 21,244 ops/sec ±0.77% (90 runs sampled)
trim12() x 21,206 ops/sec ±0.90% (66 runs sampled)
Fastest is trim0()
```