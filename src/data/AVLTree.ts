export default class AVLTree<T> {
    private root?: AVLTreeNode<T>

    get( key: number ) {
        return this.root?.getNode( key )?.value
    }

    set( key: number, value: T ) {
        if ( !this.root ) {
            this.root = new AVLTreeNode( key, value )
            return
        }
        this.root = this.root.set( key, value )
    }

    remove( key: number ) {
        this.root = this.root?.remove( key )
    }

    removeRange( min: number, max: number ) {
        this.root = this.root?.removeRange( min, max )
    }

    print() {
        this.root?.print()
    }

    get size() {
        return this.root?.size ?? 0
    }

    *[ Symbol.iterator ]() {
        if ( this.root )
            for ( let node of this.root )
                yield { key: node.key, value: node.value }
    }

    *keys() {
        if ( this.root )
            for ( let node of this.root )
                yield node.key
    }

    *values() {
        if ( this.root )
            for ( let node of this.root )
                yield node.value
    }
}

const LEFT = true
const RIGHT = false
class AVLTreeNode<T> {
    key: number
    value?: T
    left?: AVLTreeNode<T>
    right?: AVLTreeNode<T>
    height = 1
    size = 1

    constructor( key: number, value?: T ) {
        this.key = key
        this.value = value
    }

    *[ Symbol.iterator ]() {
        if ( this.left )
            yield* this.left
        yield this
        if ( this.right )
            yield* this.right
    }

    get( key: number ) { return this.getNode( key )?.value }

    set( key: number, value: T ) {
        if ( key == this.key ) {
            this.value = value
            return this
        }
        let child = this.getChildForKey( key )
        let newChild = child == null ? new AVLTreeNode( key, value ) : child.set( key, value )
        this.setChildByKey( key, newChild )
        return this.balance()
    }

    remove( key: number ) {
        if ( key == this.key )
            return this.removeSelf()
        let child = this.getChildForKey( key )
        if ( child ) {
            this.setChildByKey( key, child.remove( key ) )
            return this.balance()
        }
        return this
    }

    removeSelf() {
        if ( this.right && this.left ) {
            this.setChild( RIGHT, this.right.promoteMin( this ) )
            return this.balance()
        }
        return this.left || this.right
    }

    removeRange( min: number, max: number ) {
        if ( min <= this.key )
            this.setChild( LEFT, this.left?.removeRange( min, max ) )
        if ( max >= this.key )
            this.setChild( RIGHT, this.right?.removeRange( min, max ) )
        if ( min <= this.key && max >= this.key )
            return this.removeSelf()
        return this.balance()
    }

    promoteMin( recipientNode: AVLTreeNode<T> ) {
        if ( this.left == null ) {
            recipientNode.key = this.key
            recipientNode.value = this.value
            return undefined
        }
        this.setChild( LEFT, this.left.promoteMin( recipientNode ) )
        return this.balance()
    }

    getNode( key: number ): AVLTreeNode<T> | undefined {
        if ( key == this.key ) return this
        return this.getChildForKey( key )?.getNode( key )
    }

    getChildForKey( key: number ) { return this.getChild( this.key > key ) }
    setChildByKey( key: number, node?: AVLTreeNode<T> ) { this.setChild( this.key > key, node ) }
    getChild( side: boolean ) { return side ? this.left : this.right }
    setChild( side: boolean, node?: AVLTreeNode<T> ) {
        if ( side )
            this.left = node
        else
            this.right = node
        this.onDescendentChange()
    }

    onDescendentChange() {
        this.height = Math.max( this.left?.height ?? 0, this.right?.height ?? 0 ) + 1
        this.size = ( this.left?.size ?? 0 ) + ( this.right?.size ?? 0 ) + 1
    }

    // I know it's standard to call this rotation, but I find this verb much more intuitive.
    promoteChild( side: boolean ) {
        let promoted = this.getChild( side )
        if ( promoted == null ) throw new Error( "Attempted to promote null child." )
        let displaced = promoted.getChild( !side )
        this.setChild( side, displaced )
        promoted.setChild( !side, this )
        return promoted
    }

    balanceFactor() { return ( this.left?.height ?? 0 ) - ( this.right?.height ?? 0 ) }

    balance() {
        let balanceFactor = this.balanceFactor()
        if ( Math.abs( balanceFactor ) > 1 ) {
            let side = balanceFactor > 0
            return this.promoteChild( side )
        }
        return this
    }

    print( dent: string = "" ) {
        console.log( dent + this.key )
        if ( this.left ) this.left.print( dent + "| " )
        if ( this.right ) this.right.print( dent + "| " )
    }
}