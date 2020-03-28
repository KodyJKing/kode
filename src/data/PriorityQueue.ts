export default class PriorityQueue<T> {
    compare: ( a: T, b: T ) => number
    elements: T[]

    constructor( compare: ( a: T, b: T ) => number ) {
        this.compare = compare
        this.elements = []
    }

    maxHeapifyDown( index: number ) {
        let i = childIndex( index, true )
        let j = childIndex( index, false )
        let maxIndex = this.indexMax( index, this.indexMax( i, j ) )
        if ( maxIndex == index ) return
        swap( this.elements, index, maxIndex )
        this.maxHeapifyDown( maxIndex )
    }

    maxHeapifyUp( index: number ) {
        let i = parentIndex( index )
        let minIndex = this.indexMin( index, i )
        if ( minIndex == index ) return
        swap( this.elements, index, minIndex )
        this.maxHeapifyUp( minIndex )
    }

    push( value: T ) {
        this.elements.push( value )
        this.maxHeapifyUp( this.elements.length - 1 )
    }

    pop() {
        if ( this.elements.length == 0 ) return undefined
        let result = this.elements[ 0 ]
        let promoted = this.elements.pop() as T
        this.elements[ 0 ] = promoted
        this.maxHeapifyDown( 0 )
        return result
    }

    peek() {
        if ( this.elements.length == 0 ) return undefined
        return this.elements[ 0 ]
    }

    compareByIndex( i: number, j: number ) {
        return this.compare(
            this.elements[ i ],
            this.elements[ j ]
        )
    }

    indexMax( i: number, j: number ) {
        if ( !this.isValidIndex( j ) ) return i
        // if ( !this.isValidIndex( i ) ) return j
        return this.compareByIndex( i, j ) >= 0 ? i : j
    }

    indexMin( i: number, j: number ) {
        if ( !this.isValidIndex( j ) ) return i
        // if ( !this.isValidIndex( i ) ) return j
        return this.compareByIndex( i, j ) <= 0 ? i : j
    }

    isValidIndex( i: number ) {
        return i >= 0 && i < this.elements.length
    }
}

function swap( array: any[], i: number, j: number ) {
    let tmp = array[ i ]
    array[ i ] = array[ j ]
    array[ j ] = tmp
}

function childIndex( index: number, left: boolean ) {
    return ( index << 1 ) + ( left ? 1 : 2 )
}

function parentIndex( index: number ) {
    return ( index - 1 ) >> 1
}