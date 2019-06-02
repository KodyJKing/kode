export function merge( arr: any[], low: number, middle: number, high: number ) {
    let swap = ( i, j, li, lj ) => {
        // console.log( "swap " + li + ", " + lj )
        let tmp = arr[ i ]
        arr[ i ] = arr[ j ]
        arr[ j ] = tmp
    }

    let a = low
    let b = middle
    let c = middle

    let log = () => {
        // console.log()
        // let repr = arr.slice( 0 )
        // if ( a < high ) repr[ a ] += " -a"
        // if ( b < high ) repr[ b ] += " -b"
        // if ( c < high ) repr[ c ] += " -c"
        // console.log( repr.join( "\n" ) )
    }

    while ( a < high ) {
        if ( b >= high && c >= high ) break
        log()
        let _a = arr[ a ]
        let _b = arr[ b ]
        let _c = arr[ c ]
        if ( b > a && b < high && _a > _b && _c >= _b )
            swap( a, b++, "a", "b" )
        else if ( c > a && c < high && _a > _c )
            swap( a, c++, "a", "c" )
        a++
        if ( c == a ) c++
        if ( c == b ) c--
    }

    log()
}

export default function mergeSort( arr: any[] ) {
    let depth: string[] = []
    function _mergeSort( low, high ) {
        depth.push( "    " )
        console.log( depth.join( "" ) + [ low, high ] )
        if ( low == high ) {
            depth.pop()
            return
        }
        let middle = Math.ceil( ( low + high ) / 2 )
        _mergeSort( low, middle - 1 )
        _mergeSort( middle, high )
        merge( arr, low, middle, high )
        depth.pop()
    }

    _mergeSort( 0, arr.length )
}