/*
    DC3 suffix array construction
    https://www.cs.helsinki.fi/u/tpkarkka/publications/jacm05-revised.pdf
    https://youtu.be/NinWEPPrkDQ?t=4570

    Sorts all suffixes of a given string.
    Returns sorted array of indices corresponding to suffixes.

    DC3 replaces each character at an index with the triple starting at that index.
    DC3 then sorts each of these triples lexicographically and replaces each triple in the string with it's rank.

    DC3 then forms the strings Rk for k = 0, 1, 2
    Rk contains every third character in the string starting at k

    DC3 breaks the suffixes of a string into 3 groups.
    Sk contains suffixes starting at i = k (mod 3).

    DC3 sorts S01 = S0 U S1 recursively.
    By sorting R01 = R0 + R1, the order of S01 is obtained.

    DC3 then sorts S2 using information gained from sorting S01:
        To compare two S2 suffixes, compare the first characters and the remaining suffixes.
        The remaining suffixes are in S0 which have already been ranked.
    DC3 then merges the sorted suffixes using these rules:
        To compare S0 and S2 suffixes:
            Compare first characters and rank of remaining suffixes.
            The remaining suffixes are in S1 and S0, which are already ranked.
        To Compare S1 and S2 suffixes:
            Compare first two characters and rank of remaining suffixes.
            The remaining suffixes are in S0 and S1, which are already ranked.
*/

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
    d = defaultToNull( c ) - defaultToNull( z )
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

function range( n: number ) {
    let result = new Array( n )
    for ( let i = 0; i < n; i++ ) result[ i ] = i
    return result
}

function rankTriples( str: number[] ) {
    let tripleIndices = range( str.length )
    // Sort each index lexigraphically by the triples starting at that index.
    // TODO: Make this radix sort for linear time.
    tripleIndices.sort(
        ( i, j ) => lexCompare3(
            str[ i ], str[ i + 1 ], str[ i + 2 ],
            str[ j ], str[ j + 1 ], str[ j + 2 ]
        )
    )

    // Replace each character with the rank the corresponding triple has in sorted order.
    // Equal triples get the same rank.
    let rankedString = new Array( str.length )
    let c0 = NULL_CHAR
    let c1 = NULL_CHAR
    let c2 = NULL_CHAR
    let rank = 0
    for ( let index of tripleIndices ) {
        // Only increment the rank when the triple changes.
        if ( str[ index ] != c0 || str[ index + 1 ] != c1 || str[ index + 2 ] != c2 ) {
            rank++
            c0 = str[ index ]
            c1 = str[ index + 1 ]
            c2 = str[ index + 2 ]
        }
        rankedString[ index ] = rank
    }

    return rankedString
}

export default function suffixArray( content: string ) {
    function suffixArray( str: number[] ): number[] {
        if ( str.length == 1 )
            return [ 0 ]
        if ( str.length == 2 ) {
            if ( str[ 0 ] < str[ 1 ] )
                return [ 0, 1 ]
            return [ 1, 0 ]
        }

        // Replace character at index with rank of triple at index.
        let rankedStr = rankTriples( str )

        let stringLength = rankedStr.length
        let R0_Length = Math.ceil( stringLength / 3 )
        let R1_Length = Math.ceil( ( stringLength - 1 ) / 3 )
        let R01_Length = R0_Length + R1_Length
        let R2_Length = stringLength - R01_Length

        let sampleIndexToIndex = ( i ) => i < R0_Length ? i * 3 : ( i - R0_Length ) * 3 + 1
        let nonSampleIndexToIndex = ( i ) => i * 3 + 2

        // Concatenate R0 and R1.
        let R01 = new Array( R01_Length )
        for ( let i = 0; i < R0_Length; i++ )
            R01[ i ] = rankedStr[ 3 * i ]
        for ( let i = 0; i < R1_Length; i++ )
            R01[ i + R0_Length ] = rankedStr[ 3 * i + 1 ]

        // Recurse to sort S01.
        let suffixArray01 = suffixArray( R01 )
        console.log( "\n==================================" )
        console.log( rankedStr )
        console.log( R01 )
        console.log( "===" )
        console.log( sa2string( suffixArray01, R01 ) )
        suffixArray01 = suffixArray01.map( sampleIndexToIndex )
        console.log()
        console.log( sa2string( suffixArray01, rankedStr ) )
        console.log()
        console.log( sa2string( suffixArray01, str ) )
        console.log( "==================================\n" )

        // Rank the sampled suffixes.
        let ranks: number[] = new Array( str.length )
        for ( let i = 0; i < suffixArray01.length; i++ )
            ranks[ suffixArray01[ i ] ] = i

        // Suffix comparison rules:
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

        // Generate the S2 suffixes, then sort them using the S2 vs S2 rule.
        let suffixArray2: number[] = new Array( R2_Length )
        for ( let i = 0; i < R2_Length; i++ )
            suffixArray2[ i ] = nonSampleIndexToIndex( i )
        suffixArray2.sort( compare22 )

        // Merge using the S0 vs S2 and S1 vs S2 rules.
        let result = merge( suffixArray01, suffixArray2, ( i, j ) => {
            if ( i % 3 == 0 )
                return compare02( i, j )
            else
                return compare12( i, j )
        } )

        // console.log( result )
        // console.log( str.join( " " ) )
        // console.log( sa2string( result, str ) )
        // console.log()
        return result
    }

    // Convert string to number array.
    let str = Array.from( content ).map( ( char ) => char.charCodeAt( 0 ) )
    return suffixArray( str )
}

export function naiveSuffixArray( content: string ) {
    let str = Array.from( content ).map( ( char ) => char.charCodeAt( 0 ) )
    return range( str.length ).sort(
        ( i, j ) => {
            for ( let k = 0; k < str.length; k++ ) {
                let diff = defaultToNull( str[ i + k ] ) - defaultToNull( str[ j + k ] )
                if ( diff != 0 ) return diff
            }
            return 0
        }
    )
}

export function suffixArrayToString( array: number[], text: string ) {
    return array.map( ( i ) => text.substring( i ) ).join( "\n" )
}

function sa2string( array: number[], text: number[] ) {
    return array.map( i => text.slice( i ).join( " " ) ).join( "\n" )
}

function rank( suffixArray: number[] ) {
    let ranks = new Array( suffixArray.length )
    for ( let i = 0; i < suffixArray.length; i++ )
        ranks[ suffixArray[ i ] ] = i
    return ranks
}