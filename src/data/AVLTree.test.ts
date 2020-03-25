import test from "ava"
import AVLTree from "./AVLTree"

function log( x ) {
    console.log( JSON.stringify( x, null, 4 ).replace( /[{}",]/g, "" ).replace( / *\n *\n/g, "\n" ) )
}

test( "AVLTree", t => {

    let tree = AVLTree.create<boolean>()
    for ( let i = 0; i < 31; i++ )
        tree.set( i, true )

    console.log( "Full tree:" )
    tree.print()

    tree.remove( 0 )
    // tree.remove( 5 )

    console.log( "Trimmed tree:" )
    tree.print()

    t.pass()
} )