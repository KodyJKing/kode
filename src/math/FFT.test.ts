import test from "ava"
import Vector2 from "./Vector2";
import { naiveDFT, naiveFFT, FFT } from "./FFT";

test( "DFT comparison", t => {
    let input = [ 1, 2, 3, 4 ].map( x => new Vector2( x, 0 ) )

    let formatNumber = v => {
        let operation = v.y > 0 ? "+" : "-"
        let x = v.x.toFixed( 2 )
        let y = Math.abs( v.y ).toFixed( 2 )
        return x + " " + operation + " " + y + "i"
    }
    let formatSequence = s => s.map( formatNumber ).join( ", " )
    let print = s => console.log( formatSequence( s ) )

    let compare = ( a: Vector2[], b: Vector2[], epsilon = 1e-10 ) => {
        for ( let i = 0; i < a.length; i++ )
            if ( Math.abs( a[ i ].subtract( b[ i ] ).length ) > epsilon )
                return false;
        return true;
    }

    console.log( "INPUT:" )
    print( input )

    let funcs: any[] = [ naiveDFT, naiveFFT, FFT ]

    let naiveTransform = naiveDFT( input )

    for ( let func of funcs ) {
        console.log( func.name + ":" )
        let transform = func( input )
        let inverseTransform = func( transform, true )
        print( transform )
        print( inverseTransform )
        t.assert(
            compare( transform, naiveTransform ),
            "Transform must equal naive DFT."
        )
        t.assert(
            compare( inverseTransform, input ),
            "Inverse transform of transform must equal input."
        )
    }
} )