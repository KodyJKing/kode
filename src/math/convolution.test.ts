import test from "ava"
import convolution from "./convolution";
import Vector2 from "./Vector2";

test( "0", t => {
    let formatNumber = v => {
        let operation = v.y > 0 ? "+" : "-"
        let x = v.x.toFixed( 2 )
        let y = Math.abs( v.y ).toFixed( 2 )
        return x + " " + operation + " " + y + "i"
    }
    let formatSequence = s => s.map( formatNumber ).join( ", " )
    let print = s => console.log( formatSequence( s ) )

    let a = [ 1, 0, 0, 0, 0, 0, 0, 0 ].map(x => new Vector2(x, 0))
    let b = [ 0, 0, 0, 1, 1, 0, 0, 0 ].map( x => new Vector2( x, 0 ) )
    let ab = convolution(a, b)
    print(ab)

    t.pass()
} )