import test from "ava"
import mergeSort, { merge } from "./mergesort";

function sorted( arr: any[] ) {
    for ( let i = 1; i < arr.length; i++ )
        if ( arr[ i - 1 ] > arr[ i ] )
            return false
    return true
}

// test( "merge", t => {
//     let input = "[[8,13,22,3,9,11],3]"
//     let [ a, middle ] = JSON.parse( input )
//     merge( a, 0, middle, a.length )
//     t.assert( sorted( a ), JSON.stringify( a ) + " is not sorted" )

//     // for ( let i = 0; i < 1000; i++ ) {
//     //     let arr: number[] = []
//     //     let value = 0
//     //     let SCALE = 2
//     //     let count = ( Math.random() * SCALE + SCALE ) | 0
//     //     for ( let j = 0; j < count; j++ ) {
//     //         value += ( 1 + Math.random() * 10 ) | 0
//     //         arr.push( value )
//     //     }
//     //     let middle = arr.length
//     //     value = 0
//     //     count = ( Math.random() * SCALE + SCALE ) | 0
//     //     for ( let j = 0; j < count; j++ ) {
//     //         value += ( 1 + Math.random() * 10 ) | 0
//     //         arr.push( value )
//     //     }

//     //     let original = JSON.stringify( [ arr, middle ] )

//     //     merge( arr, 0, middle, arr.length )
//     //     t.assert( sorted( arr ), JSON.stringify( arr ) + " is not sorted.\nOriginal: " + original )
//     // }
// } )

test( "merge", t => {
    let a = [ 2, 1, 10, 3, 5, 1, 3 ]
    mergeSort( a )
    t.assert( sorted( a ), JSON.stringify( a ) + " is not sorted" )
} )