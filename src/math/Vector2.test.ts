import test from "ava"
import Vector2 from "./Vector2";

test( "arithmetic", t => {
    t.deepEqual( new Vector2( 10, 20 ), new Vector2( 1, 2 ).multiply( 10 ) )
    t.deepEqual( new Vector2( 1, 2 ), new Vector2( 10, 20 ).divide( 10 ) )
    t.deepEqual( new Vector2( 11, 22 ), new Vector2( 1, 2 ).add( new Vector2( 10, 20 ) ) )
    t.deepEqual( new Vector2( 1, 2 ), new Vector2( 11, 22 ).subtract( new Vector2( 10, 20 ) ) )
} )

test( "complex arithmetic", t => {
    let coefficient = new Vector2( -10, 10 )
    let v = new Vector2( 10, 10 )
    t.notDeepEqual( v, v.complexProduct( coefficient ) )
    t.deepEqual( v, v.complexProduct( coefficient ).complexQuotient( coefficient ) )
} )