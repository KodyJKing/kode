export function merge( a, b, compare ) {
    let i = 0
    let j = 0
    let result: any[] = []
    while ( i < a.length || j < b.length ) {
        let aSmaller = i < a.length && ( j >= b.length || compare( a[ i ], b[ j ] ) < 0 )
        result.push( aSmaller ? a[ i++ ] : b[ j++ ] )
    }
    return result
}