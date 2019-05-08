import Vector2 from "./Vector2";

/*
    The Fast Fourier Transform is an efficient implementation of the Discrete Fourier Transform.
    The DFT takes n samples of an n degree polynomial. The coefficients of the polynomial are the input.
    The samples are spread evenly around the complex unit circle. They take for form e^(i2PI*k/n) = 1^(k/n) for k = 0, 1 ... n.

    The naive implementation samples these points one at a time.
    Using Horner's rule, a polyomial can be evaluated in O(N) time, 
    so for n samples, the total runtime is O(N^2).

    The FFT improves on this with a divide and conquer approach. 
    
    NOTE: The algorithm relies on n being a power of two.
    The input can be padded with zeros if its length isn't a power of two.

    The FFT calculates the polynomial, P(a, x) = a0 x^0 + a1 x^1 ..., by splitting it into even and odd terms:
        P(a, x) = P_even(a, x) + P_odd(a, x)
        = (a0 x^0 + a2 x^2 ...) + (a1 x^1 + a3 x^3 ...)
        = P(a_even, x^2) + x * P(a_odd, x^2)

    Because n is a power of two, the x values take the form:
        x = 1^(k/2^m)
        = 1^(q+r/2^m) // quotient plus remainder form, r = k (mod 2^m)
        = 1^(r/2^m) // Note that 0 <= r < 2^m

    When we square x we get 1^(r/2^(m-1)), halving the number of possible values.
    Intutively, this is because squaring doubles the angle between a number and the x-axis, 
    so values on the unit circle can wrap around onto eachother.
    This means the polynomial function is called on half the number of coefficients AND x values.
    This is continued recursively until the base case where there is only one coefficient and value.
    In the base case, the polynomial can be evaluated in O(1).
    
    Because both inputs are halved every recursion, the depth of the call tree is O(log n).
    However, because two calls are made for every call, the "width" of the call tree is constant.
    The total runtime is then O(n log n).
 */

/*
    This is a naive implementation of the Discrete Fourier Transform.
    It serves as a definition. The FFT should be tested against results from this.
*/
export function SFT( a: Vector2[], inverse = false ) {
    let X: Vector2[] = []
    let n = a.length
    let coefficient = inverse ? 1 / n : 1
    let angleSign = inverse ? 1 : -1
    for ( let k = 0; k < n; k++ ) {
        let angle = k / n * Math.PI * 2 * angleSign
        let x = Vector2.polar( angle, 1 )
        let exponential = new Vector2( 1, 0 )
        let result = new Vector2( 0, 0 )
        for ( let p = 0; p < n; p++ ) {
            result = result.add( exponential.complexProduct( a[ p ].multiply( coefficient ) ) )
            exponential = exponential.complexProduct( x )
        }
        X.push( result )
    }
    return X
}

/*
    This is a proper FFT but it uses wasteful allocatiton of arrays
    for even and odd coefficients. It is kept for reference.
*/
export function FFT( a: Vector2[], inverse = false ): Vector2[] {
    let n = a.length
    let coefficient = inverse ? 1 / n : 1
    let angleSign = inverse ? 1 : -1

    function internalFFT( x: Vector2[] ) {
        let n = x.length
        let halfN = n / 2

        if ( n == 1 )
            return [ x[ 0 ].multiply( coefficient ) ]

        // Wasteful allocation.
        let evens: Vector2[] = []
        let odds: Vector2[] = []
        for ( let i = 0; i < n; i++ ) ( ( i & 1 ) == 0 ? evens : odds ).push( x[ i ] )

        let evenFFT = internalFFT( evens )
        let oddFFT = internalFFT( odds )

        let result: Vector2[] = []
        for ( let k = 0; k < n; k++ ) {
            let index = k % halfN
            let angle = k / n * Math.PI * 2 * angleSign
            let x = Vector2.polar( angle, 1 )
            result.push( evenFFT[ index ].add( oddFFT[ index ].complexProduct( x ) ) )
        }
        return result
    }

    return internalFFT( a )
}

export function OFFT( a: Vector2[], inverse = false ): Vector2[] {
    let N = a.length
    let coefficient = inverse ? 1 / N : 1
    let angleSign = inverse ? 1 : -1

    function internalFFT( n = N, shift = 0, step = 1 ) {
        let halfN = n / 2

        if ( n == 1 )
            return [ a[ shift ].multiply( coefficient ) ]

        let evenFFT = internalFFT( n / 2, shift, step * 2 )
        let oddFFT = internalFFT( n / 2, shift + step, step * 2 )

        let result: Vector2[] = []
        for ( let k = 0; k < n; k++ ) {
            let index = k % halfN
            let angle = k / n * Math.PI * 2 * angleSign
            let x = Vector2.polar( angle, 1 )
            result.push( evenFFT[ index ].add( oddFFT[ index ].complexProduct( x ) ) )
        }
        return result
    }

    return internalFFT()
}