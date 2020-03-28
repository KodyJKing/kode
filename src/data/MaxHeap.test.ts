import test from "ava"
import MaxHeap from "./MaxHeap"

test( "pop order", t => {
    let q = new MaxHeap<number>( ( a, b ) => a - b )
    let count = 100

    for ( let i = 0; i < count; i++ )
        q.push( Math.random() * 100 )

    let last = q.pop() as number
    for ( let i = 0; i < count - 1; i++ ) {
        let current = q.pop() as number
        t.assert( current <= last )
        last = current
    }

    t.assert( q.pop() == undefined )
} )