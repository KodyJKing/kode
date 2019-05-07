import Vector2 from "./Vector2";

/*
    FFT takes n samples of an n degree polynomial. 
    The coefficients are provided as an argument.
    The samples are evenly space roots of 1 starting with 1.
 */

// Slow Fourier Discrete Fourier Transform
// This is serves as a defenition.
// The FFT should be tested against results from this.
export function SFT( x: Vector2[], inverse = false ) {
    let X: Vector2[] = []
    let n = x.length
    let coefficient = inverse ? 1 / n : 1
    let angleSign = inverse ? 1 : -1
    for ( let k = 0; k < n; k++ ) {
        let angle = k / n * Math.PI * 2 * angleSign
        let input = Vector2.polar( angle, 1 )
        let exponential = new Vector2( 1, 0 )
        let result = new Vector2( 0, 0 )
        for ( let p = 0; p < n; p++ ) {
            result = result.add( exponential.complexProduct( x[p].multiply(coefficient) ) )
            exponential = exponential.complexProduct( input )
        }
        X.push( result )
    }
    return X
}

// This is an intermediate FFT.
// It uses divide and conquer and is O(n*log n),
// but uses wasteful allocatiton of arrays for even and odd coefficients.
// This is kept for reference.
export function FFT( x: Vector2[], inverse = false ): Vector2[] {
    let n = x.length
    let coefficient = inverse ? 1 / n : 1
    let angleSign = inverse ? 1 : -1

    function internalFFT(x: Vector2[]) {
        let n = x.length
        let halfN = n / 2
    
        if ( n == 1 )
            return [x[0].multiply( coefficient )]
    
        // Wasteful allocation.
        let evens: Vector2[] = []
        let odds: Vector2[] = []
        for ( let i = 0; i < n; i++ ) ( ( i & 1 ) == 0 ? evens : odds ).push( x[i] )
    
        let evenFFT = internalFFT( evens )
        let oddFFT = internalFFT( odds )
    
        let result: Vector2[] = []
        for ( let k = 0; k < n; k++ ) {
            let index = k % halfN
            let angle = k / n * Math.PI * 2 * angleSign
            result.push(
                evenFFT[index].add(
                    oddFFT[index].complexProduct(
                        Vector2.polar( angle, 1 )
                    )
                )
            )
        }
        return result
    }

    return internalFFT(x)
}

export function OFFT( x: Vector2[], inverse = false ): Vector2[] {
    let N = x.length
    let coefficient = inverse ? 1 / N : 1
    let angleSign = inverse ? 1 : -1

    function internalFFT( n = N, shift = 0, step = 1 ) {
        let halfN = n / 2

        if (n == 1)
            return [x[shift].multiply( coefficient )]

        let evenFFT = internalFFT( n / 2, shift, step * 2 )
        let oddFFT = internalFFT( n / 2, shift + step, step * 2 )

        let result: Vector2[] = []
        for ( let k = 0; k < n; k++ ) {
            let index = k % halfN
            let angle = k / n * Math.PI * 2 * angleSign
            result.push(
                evenFFT[index].add(
                    oddFFT[index].complexProduct(
                        Vector2.polar( angle, 1 )
                    )
                )
            )
        }
        return result
    }

    return internalFFT()
}