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

    set( key: number, value: T, parent?: AVLTreeNode<T> ) {
        if ( key == this.key ) {
            this.value = value
            return
        }

        let child = this.getChildForKey( key )
        let side = this.key > key
        if ( child == null )
            this.setChild( side, new AVLTreeNode( key, value ) )
        else
            child.set( key, value, this )

        this.onDescendentChange()

        if ( parent )
            this.balance( parent )
    }

    remove( key: number, parent?: AVLTreeNode<T> ) {
        if ( key == this.key ) {
            if ( parent )
                this.removeSelf( parent )
            else
                throw new Error( "Cannot remove node without parent ref." )
        } else {
            let child = this.getChildForKey( key )
            if ( child )
                child.remove( key, this )
            this.onDescendentChange()
        }
    }

    get( key: number ) {
        let node = this.getNode( key )
        return node ? node.value : undefined
    }

    protected removeSelf( parent: AVLTreeNode<T> ) {
        if ( this.right == null || this.left == null ) {
            parent.replaceChild( this, this.left || this.right )
            return
        }
        let rightMin = this.right.popMin( this )
        this.key = rightMin.key
        this.value = rightMin.value
    }

    protected popMin( parent: AVLTreeNode<T> ) {
        if ( this.left == null ) {
            parent.replaceChild( this, this.right )
            return this
        }
        let result = this.left.popMin( this )
        this.onDescendentChange()
        this.balance( parent )
        return result
    }

    protected getNode( key: number ): AVLTreeNode<T> | undefined {
        if ( key == this.key ) return this
        let child = this.getChildForKey( key )
        if ( child ) return child.getNode( key )
    }

    protected getChildForKey( key: number ) { return this.getChild( this.key > key ) }

    protected getChild( left: boolean ) { return left ? this.left : this.right }

    protected setChild( left: boolean, node?: AVLTreeNode<T> ) {
        if ( left )
            this.left = node
        else
            this.right = node
        this.onDescendentChange()
    }

    protected replaceChild( oldChild: AVLTreeNode<T>, newChild?: AVLTreeNode<T> ) {
        this.setChild( this.key > oldChild.key, newChild )
    }

    protected getHeight( left: boolean ) {
        let child = this.getChild( left )
        return child ? child.height : 0
    }

    protected onDescendentChange() {
        this.height = Math.max( this.getHeight( LEFT ), this.getHeight( RIGHT ) ) + 1
    }

    protected promoteChild( left: boolean, parent: AVLTreeNode<T> ) {
        let promoted = this.getChild( left )
        if ( promoted == null ) throw new Error( "Cannot rotate node. There is no node to promote." )
        let displaced = promoted.getChild( !left )
        this.setChild( left, displaced )
        promoted.setChild( !left, this )
        parent.replaceChild( this, promoted )
    }

    protected balance( parent: AVLTreeNode<T> ) {
        let heightDiff = this.getHeight( LEFT ) - this.getHeight( RIGHT )
        let absDiff = Math.abs( heightDiff )
        if ( absDiff > 1 ) {
            let left = heightDiff > 0
            this.promoteChild( left, parent )
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
}