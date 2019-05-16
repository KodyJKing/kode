type func = ( x: number ) => number
type derivative = (x: number, fx: number) => number

export function newtonRaphson( f: func, df: derivative, y = 0, epsilon = 1e-15, x = 0 ) {
    let g = x => f( x ) - y
    while ( true ) {
        let gx = g( x )
        if ( Math.abs( gx ) < epsilon )
            return x
        x = x - gx / df( x, gx + y )
    }
}

export function finiteDifference( f: func, y = 0, h = 0.1, epsilon = 1e-15, x = 0 ) {
    let invH = 1 / h
    let df = ( x, fx ) => ( f( x + h ) - fx ) * invH
    return newtonRaphson(f, df, y, epsilon, x)
}