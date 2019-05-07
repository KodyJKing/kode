import test from "ava"
import Vector2 from "./Vector2";
import { SFT, FFT, OFFT } from "./FFT";

test( "OFFTvsFFTvsSFT", t => {
    let input = [1, 2, 3, 4].map( x => new Vector2( x, 0 ) )

    let format = v => {
        let x = v.x.toFixed( 2 )
        let y = Math.abs( v.y ).toFixed( 2 )
        let operation = v.y > 0 ? "+" : "-"
        return `${x} ${operation} ${y}i`
    }
    let print = s => console.log( s.map( format ).join( ", " ) )

    console.log( "INPUT:" )
    print( input )
    console.log()

    let funcs: any[] = [SFT, FFT, OFFT]

    for ( let func of funcs ) {
        console.log( func.name + ":" )
        let transform = func( input )
        let inverseTransform = func( transform, true )
        print(transform)
        print(inverseTransform)
    }
    t.pass()
} )