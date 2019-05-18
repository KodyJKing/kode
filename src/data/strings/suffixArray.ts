import { merge } from "../sorting/merge";

const NULL_CHAR = -1

function defaultToNull( char: number ) {
    return char == undefined ? NULL_CHAR : char
}

function lexCompare3( a: number, b: number, c: number, x: number, y: number, z: number ) {
    let d = defaultToNull( a ) - defaultToNull( x )
    if ( d != 0 ) return d
    d = defaultToNull( b ) - defaultToNull( y )
    if ( d != 0 ) return d
    d = defaultToNull( x ) - defaultToNull( z )
    if ( d != 0 ) return d
    return 0
}

function lexCompare2( a: number, b: number, x: number, y: number ) {
    let d = defaultToNull( a ) - defaultToNull( x )
    if ( d != 0 ) return d
    d = defaultToNull( b ) - defaultToNull( y )
    if ( d != 0 ) return d
    return 0
}

function contractAndRank( str: number[], verbose: boolean ) {
    let indices = range( str.length )
    // TODO: Make this radix sort for linear time.
    indices.sort(
        ( i, j ) => {
            for ( let k = 0; k < 3; k++ ) {
                let d = defaultToNull( str[ i + k ] ) - defaultToNull( str[ j + k ] )
                if ( d != 0 ) return d
            }
            return 0
        }
    )

    let ranks = new Array( str.length )
    let c0 = -1
    let c1 = -1
    let c2 = -1
    let rank = 0
    for ( let index of indices ) {
        if ( str[ index ] != c0 || str[ index + 1 ] != c1 || str[ index + 2 ] != c2 ) {
            rank++
            c0 = str[ index ]
            c1 = str[ index + 1 ]
            c2 = str[ index + 2 ]
        }
        ranks[ index ] = rank
    }

    return str.map( ( v, i ) => ranks[ i ] )
}

function range( n: number ) {
    let result = new Array( n )
    for ( let i = 0; i < n; i++ ) result[ i ] = i
    return result
}

export default function suffixArray( content: string ) {
    function suffixArray( str: number[], verbose = false ): number[] {
        if ( str.length == 1 )
            return [ 0 ]
        if ( str.length == 2 ) {
            if ( str[ 0 ] - str[ 1 ] < 0 )
                return [ 0, 1 ]
            return [ 1, 0 ]
        }

        let rankedStr = contractAndRank( str, verbose )

        let R0: number[] = []
        let R1: number[] = []
        let R2: number[] = []
        let RN: number[][] = [ R0, R1, R2 ]
        for ( let i = 0; i < rankedStr.length; i++ )
            RN[ i % 3 ].push( rankedStr[ i ] )

        let R01 = R0.concat( R1 )

        let sampleIndexToIndex = ( i ) => i < R0.length ? i * 3 : ( i - R0.length ) * 3 + 1
        let nonSampleIndexToIndex = ( i ) => i * 3 + 2
        let suffixArray01 = suffixArray( R01 ).map( sampleIndexToIndex )

        let ranks: number[] = new Array( str.length )
        for ( let i = 0; i < suffixArray01.length; i++ )
            ranks[ suffixArray01[ i ] ] = i

        let compare02 = ( i, j ) => lexCompare2(
            rankedStr[ i ], ranks[ i + 1 ],
            rankedStr[ j ], ranks[ j + 1 ]
        )
        let compare12 = ( i, j ) => lexCompare3(
            rankedStr[ i ], rankedStr[ i + 1 ], ranks[ i + 2 ],
            rankedStr[ j ], rankedStr[ j + 1 ], ranks[ j + 2 ]
        )
        let compare22 = ( i, j ) => lexCompare2(
            rankedStr[ i ], ranks[ i + 1 ],
            rankedStr[ j ], ranks[ j + 1 ]
        )

        let suffixArray2: number[] = new Array( R2.length )
        for ( let i = 0; i < R2.length; i++ )
            suffixArray2[ i ] = nonSampleIndexToIndex( i )
        suffixArray2.sort( compare22 )

        if ( verbose ) {
            // console.log(rankedStr)
            // console.log()
            // console.log(R01)
            // console.log(R2)
            // console.log()
            // console.log(SA01)
            // console.log(SA2)
            // console.log()
        }

        return merge( suffixArray01, suffixArray2, ( i, j ) => {
            if ( i % 3 == 0 )
                return compare02( i, j )
            else
                return compare12( i, j )
        } )
    }

    let str = Array.from( content ).map( ( char ) => char.charCodeAt( 0 ) )
    return suffixArray( str, true )
}
