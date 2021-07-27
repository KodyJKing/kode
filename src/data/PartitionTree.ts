const maxLeaves = 10
const condenseFactor = 2 / 3

export default class PartitionTree<T> {
    min: number
    max: number
    mid: number
    keys: number[]
    values: T[]
    children: PartitionTree<T>[]
    size: number = 0

    constructor( min: number, max: number ) {
        this.min = min
        this.max = max
        this.mid = ( this.min + this.max ) / 2
        this.keys = []
        this.values = []
        this.children = []
    }

    get isTerminal() { return this.children.length == 0 }

    set( key: number, value: T ) {
        if ( this.isTerminal )
            this.setLeaf( key, value )
        else
            this.setOnChild( key, value )
        this.recalculate()
        if ( this.size > maxLeaves )
            this.divide()
    }

    setLeaf( key: number, value: T ) {
        let i = this.keys?.indexOf( key ) ?? -1
        if ( i >= 0 ) {
            this.values[ i ] = value
        } else {
            this.keys.push( key )
            this.values.push( value )
        }
    }

    remove( key: number ) {
        if ( this.isTerminal )
            this.removeLeaf( key )
        else
            this.childByKey( key ).remove( key )
        this.recalculate()
        if ( this.size < maxLeaves * condenseFactor )
            this.condense()
    }

    removeLeaf( key: number ) {
        let i = this.keys?.indexOf( key ) ?? -1
        if ( i >= 0 ) {
            this.keys.splice( i, 1 )
            this.values.splice( i, 1 )
        }
    }

    childByKey( key: number ): PartitionTree<T> { return key <= this.mid ? this.children[ 0 ] : this.children[ 1 ] }
    setOnChild( key: number, value: T ) { this.childByKey( key ).set( key, value ) }

    divide() {
        if ( !this.isTerminal ) return
        let { min, max, mid, keys, values } = this
        this.children.push( new PartitionTree<T>( min, mid ) )
        this.children.push( new PartitionTree<T>( mid, max ) )
        for ( let i = 0; i < this.values.length; i++ )
            this.setOnChild( keys[ i ], values[ i ] )
        this.keys.length = 0
        this.values.length = 0
    }

    condense() {
        for ( let child of this.children )
            for ( let i = 0; i < child.keys.length; i++ )
                this.setLeaf( child.keys[ i ], child.values[ i ] )
        this.children.length = 0
    }

    recalculate() {
        this.size = this.values.length
        for ( let child of this.children )
            this.size += child.size
    }

    print( dent = "" ) {
        let { min, max, values, keys, children } = this
        let pairs: string[] = []
        for ( let i = 0; i < keys.length; i++ )
            pairs.push( keys[ i ] + ": " + values[ i ] )
        let leaves = this.values.length == 0 ? "" : "{ " + pairs.join( ", " ) + " }"
        console.log( `${dent}[${min} - ${max}] ${leaves}` )
        for ( let child of children )
            child.print( dent + "| " )
    }
}
