function normalize(v: { x: number; y: number }): { x: number; y: number } {
  const len = Math.sqrt(v.x ** 2 + v.y ** 2);
  return scale(v, 1 / len);
}

function scale(
  v: { x: number; y: number },
  k: number
): { x: number; y: number } {
  return { x: v.x * k, y: v.y * k };
}

/**
 * a b
 * c d
 */
export function eigen(a: number, b: number, c: number, d: number) {
  const D = (a + d) ** 2 - 4 * (a * d - b * c);
  if (D < 0) {
    throw new Error("complex");
  }
  const lambda1 = (a + d + Math.sqrt(D)) / 2;
  const lambda2 = (a + d - Math.sqrt(D)) / 2;

  // https://math.stackexchange.com/questions/4103294/is-there-a-closed-form-expression-for-the-eigenvectors-of-a-2x2-matrix
  return [
    {
      eigenvector: scale(
        normalize({
          x: b,
          y: lambda1 - a,
        }),
        lambda1
      ),
      eigenvalue: lambda1,
    },
    {
      eigenvector: scale(
        normalize({
          x: lambda2 - d,
          y: c,
        }),
        lambda2
      ),
      eigenvalue: lambda2,
    },
  ];
  // (𝑎−𝜆)(𝑑−𝜆)−𝑏𝑐=0
  // ad - a𝜆 - d𝜆 + 𝜆^2 - bc = 0
  // ad - (a + d)𝜆 + 𝜆^2 - bc = 0
  // 𝜆^2 - (a + d)𝜆 + ad - bc = 0
  // 𝜆 = ((a + d) ± √( (a + d)^2 - 4(ad - bc) ) ) /2

  // Ax = 𝜆x
  // [a,b;c,d][x, y] = 𝜆[x, y]
  // 1) ax + by = 𝜆x
  // 2) cx + dy = 𝜆y

  // (a - 𝜆)x + by = 0
  // cx + (d - 𝜆)y = 0

  // (𝜆 - a)x = by
  // (𝜆 - d)y = cx

  // (b, 𝜆 - a)
  // (𝜆 - d, c)

  // (ub, u(𝜆 - a))
  // (v(𝜆 - d), vc)

  // ub = v(𝜆 - d)
  // u(𝜆 - a) = vc

  // old
  // (a - 𝜆)x = - by
  // x = -by / (a - 𝜆)
  // y = -cx / (d - 𝜆)
  // y = -c(-by / (a - 𝜆)) / (d - 𝜆)
  // y = (cby / (a - 𝜆)) / (d - 𝜆)
  // y = cby / ((a - 𝜆) * (d - 𝜆))

  // Ax = 𝜆x
  // Ax = 𝜆Ix
  // (A - 𝜆I)x = 0
}

console.log(eigen(3, 3, 1, 3));

// 3 3
// 1 3
