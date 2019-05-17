import { merge } from "../sorting/merge";

type triple = [ number, number, number ]
type char = number | triple
type chars = char[]

const NULL_CHAR = -1

function compareChar( a: char, b: char ) {
    if ( typeof a == "number" && typeof b == "number" )
        return a - b
    if ( Array.isArray( a ) && Array.isArray( b ) )
        return lexCompare( a, b )
    return 0
}

function defaultToNull( char: number ) {
    return char == undefined ? NULL_CHAR : char
}

function lexCompare( a: number[], b: number[] ) {
    for ( let i = 0; i < a.length; i++ ) {
        let d = defaultToNull( a[ i ] ) - defaultToNull( b[ i ] )
        if ( d != 0 ) return d
    }
    return 0
}

function removeDuplicates( arr: any[], key = ( e ) => e.toString() ) {
    let result: any[] = []
    let visited = {}
    for ( let elem of arr ) {
        let k = key( elem )
        if ( visited[ k ] ) continue
        visited[ k ] = true
        result.push( elem )
    }
    return result
}

// TODO: Do this implicitly. Don't actually create the triples.
// Just take the indices and base string.
// Also, replace all sorts with radix sort to achieve linear time.
function replaceCharactersWithRank( str: chars ) {
    let alphabet = removeDuplicates( str ) as chars
    alphabet.sort( compareChar )

    let ranks: { [ name: string ]: number } = {}
    let rank = 0
    for ( let char of alphabet )
        ranks[ char.toString() ] = rank++

    let result: number[] = []
    for ( let char of str )
        result.push( ranks[ char.toString() ] )

    return result
}

// function contractAndRank( str: number[], verbose: boolean ) {
//     let indices = str.map( ( v, i ) => i )
//     indices = removeDuplicates( indices, ( i ) => str.slice( i, i + 3 ) )
//     indices.sort( ( i, j ) => lexCompare( str.slice( i, i + 3 ), str.slice( j, j + 3 ) ) )

//     let ranks: { [ name: string ]: number } = {}
//     let rank = 0
//     for ( let i of indices )
//         ranks[ str.slice( i, i + 3 ).toString() ] = rank++

//     if ( verbose ) {
//         console.log( str.map( n => String.fromCharCode( n ) ).join( "" ) )
//         console.log( indices )
//         console.log( ranks )
//         console.log()
//     }

//     return str.map( ( v, i ) => ranks[ str.slice( i, i + 3 ).toString() ] )
// }

export default function suffixArray( content: string ) {
    function suffixArray( str: number[], verbose = false ): number[] {
        if ( str.length == 1 )
            return [ 0 ]
        if ( str.length == 2 ) {
            if ( compareChar( str[ 0 ], str[ 1 ] ) < 0 )
                return [ 0, 1 ]
            return [ 1, 0 ]
        }

        let rankedStr = replaceCharactersWithRank( str )
        // let rankedStr2 = contractAndRank( str, verbose )

        // if ( verbose ) {
        //     console.log( rankedStr )
        //     console.log( rankedStr2 )
        // }

        let R0: chars = []
        let R1: chars = []
        let R2: chars = []
        let RN: chars[] = [ R0, R1, R2 ]
        for ( let i = 0; i < rankedStr.length; i++ ) {
            let char: triple = [ rankedStr[ i ], rankedStr[ i + 1 ], rankedStr[ i + 2 ] ]
            RN[ i % 3 ].push( char )
        }

        let R01 = R0.concat( R1 )

        let sampleIndexToIndex = ( i ) => i < R0.length ? i * 3 : ( i - R0.length ) * 3 + 1
        let nonSampleIndexToIndex = ( i ) => i * 3 + 2
        let suffixArray01 = suffixArray( R01 ).map( sampleIndexToIndex )

        let ranks: number[] = new Array( str.length )
        for ( let i = 0; i < suffixArray01.length; i++ )
            ranks[ suffixArray01[ i ] ] = i

        let suffixArray2: number[] = R2
            .map( ( v, i ) => i )
            .sort( ( i, j ) => lexCompare(
                [ rankedStr[ 3 * i + 2 ], ranks[ 3 * i + 3 ] ],
                [ rankedStr[ 3 * j + 2 ], ranks[ 3 * j + 3 ] ]
            )
            )
            .map( nonSampleIndexToIndex )

        // if (verbose) {
        //     console.log(rankedStr)
        //     console.log()
        //     console.log(R01)
        //     console.log(R2)
        //     console.log()
        //     console.log(SA01)
        //     console.log(SA2)
        //     console.log()
        // }

        return merge( suffixArray01, suffixArray2, ( i, j ) => {
            if ( i % 3 == 0 ) {
                return lexCompare(
                    [ rankedStr[ i ], ranks[ i + 1 ] ],
                    [ rankedStr[ j ], ranks[ j + 1 ] ]
                )
            } else {
                return lexCompare(
                    [ rankedStr[ i ], rankedStr[ i + 1 ], ranks[ i + 2 ] ],
                    [ rankedStr[ j ], rankedStr[ j + 1 ], ranks[ j + 2 ] ]
                )
            }
        } )
    }
    let str = Array.from( content ).map( ( char ) => char.charCodeAt( 0 ) )
    return suffixArray( str, true )
}
