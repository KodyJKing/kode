const LEFT = true
const RIGHT = false
class AVLTreeNode<T> {
    protected key: number
    protected value?: T
    protected left?: AVLTreeNode<T>
    protected right?: AVLTreeNode<T>
    protected height = 1
    protected size = 0

    protected constructor( key: number, value?: T ) {
        this.key = key
        this.value = value
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

    protected removeSelf() {
        if ( this.right && this.left ) {
            this.setChild( RIGHT, this.right.promoteMin( this ) )
            return this.balance()
        }
        return this.left || this.right
    }

    protected promoteMin( recipientNode: AVLTreeNode<T> ) {
        if ( this.left == null ) {
            recipientNode.key = this.key
            recipientNode.value = this.value
            return undefined
        }
        this.setChild( LEFT, this.left.promoteMin( recipientNode ) )
        return this.balance()
    }

    protected getNode( key: number ): AVLTreeNode<T> | undefined {
        if ( key == this.key ) return this
        return this.getChildForKey( key )?.getNode( key )
    }

    protected getChildForKey( key: number ) { return this.getChild( this.key > key ) }
    protected setChildByKey( key: number, node?: AVLTreeNode<T> ) { this.setChild( this.key > key, node ) }
    protected getChild( side: boolean ) { return side ? this.left : this.right }
    protected setChild( side: boolean, node?: AVLTreeNode<T> ) {
        if ( side )
            this.left = node
        else
            this.right = node
        this.onDescendentChange()
    }

    protected onDescendentChange() {
        this.height = Math.max( this.left?.height ?? 0, this.right?.height ?? 0 ) + 1
    }

    protected promoteChild( side: boolean ) {
        let promoted = this.getChild( side )
        if ( promoted == null ) throw new Error( "Cannot rotate node. There is no node to promote." )
        let displaced = promoted.getChild( !side )
        this.setChild( side, displaced )
        promoted.setChild( !side, this )
        return promoted
    }

    protected balanceFactor() { return ( this.left?.height ?? 0 ) - ( this.right?.height ?? 0 ) }

    protected balance() {
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

export default class AVLTree<T> extends AVLTreeNode<T> {
    static create<T>() {
        return new AVLTree<T>( Infinity, undefined )
    }

    print( dent: string = "" ) {
        if ( this.left )
            this.left.print( dent )
    }

    protected balance() { return this }
    protected onDescendentChange() { }

}