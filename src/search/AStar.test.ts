import test from "ava"
import { AStar } from "./AStar"

test( "AStar", t => {
    let graph = {
        a: { b: 2, c: 100 },
        b: { d: 100 },
        c: { d: 1 },
        d: { e: 1 },
        e: {}
    }

    let result = AStar<string, string>(
        {
            getNeighbors: s => Object.keys( graph[ s ] ),
            getCost: ( s0, s1 ) => graph[ s0 ][ s1 ] ?? Infinity,
            getHeuristicCost: s => 0,
            getKey: s => s,
            isSolution: s => s == "e"
        },
        "a"
    )

    t.deepEqual( result, { path: [ 'a', 'c', 'd', 'e' ], cost: 102 } )
} )