const LEFT = true
const RIGHT = false
class AVLTreeNode<T> {
    protected key: number
    protected value?: T
    protected left?: AVLTreeNode<T>
    protected right?: AVLTreeNode<T>
    protected height = 1

    protected constructor( key: number, value?: T ) {
        this.key = key
        this.value = value
    }

    get( key: number ) {
        let node = this.getNode( key )
        return node ? node.value : undefined
    }

    set( key: number, value: T ) {
        if ( key == this.key ) {
            this.value = value
            return this
        }
        let child = this.getChildForKey( key )
        let newChild = child == null ? new AVLTreeNode( key, value ) : child.set( key, value )
        let side = this.key > key
        this.setChild( side, newChild )
        return this.balance()
    }

    remove( key: number ) {
        if ( key == this.key ) {
            return this.removeSelf()
        } else {
            let child = this.getChildForKey( key )
            let side = this.key > key
            if ( child ) {
                this.setChild( side, child.remove( key ) )
                return this.balance()
            }
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
        let child = this.getChildForKey( key )
        if ( child ) return child.getNode( key )
    }

    protected getChildForKey( key: number ) { return this.getChild( this.key > key ) }

    protected getChild( side: boolean ) { return side ? this.left : this.right }

    protected setChild( side: boolean, node?: AVLTreeNode<T> ) {
        if ( side )
            this.left = node
        else
            this.right = node
        this.onDescendentChange()
    }

    protected replaceChild( oldChild: AVLTreeNode<T>, newChild?: AVLTreeNode<T> ) {
        this.setChild( this.key > oldChild.key, newChild )
    }

    protected getHeight( side: boolean ) {
        let child = this.getChild( side )
        return child ? child.height : 0
    }

    protected onDescendentChange() {
        this.height = Math.max( this.getHeight( LEFT ), this.getHeight( RIGHT ) ) + 1
    }

    protected promoteChild( side: boolean ) {
        let promoted = this.getChild( side )
        if ( promoted == null ) throw new Error( "Cannot rotate node. There is no node to promote." )
        let displaced = promoted.getChild( !side )
        this.setChild( side, displaced )
        promoted.setChild( !side, this )
        return promoted
    }

    protected balance() {
        let heightDiff = this.getHeight( LEFT ) - this.getHeight( RIGHT )
        let absDiff = Math.abs( heightDiff )
        if ( absDiff > 1 ) {
            let side = heightDiff > 0
            return this.promoteChild( side )
        }
        return this
    }

    print( dent: string = "" ) {
        // let heightDiff = this.getHeight( LEFT ) - this.getHeight( RIGHT )
        // console.log( dent + heightDiff )
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