import test from "ava"
import AVLTree from "./AVLTree"

test( "AVLTree", t => {
    let tree = new AVLTree<boolean>()
    for ( let i = 0; i < 7; i++ )
        tree.set( i, true )

    console.log( "Full tree:" )
    tree.print()

    // tree.remove( 0 )
    for ( let i = 0; i < 7; i++ )
        tree.remove( i )

    console.log( "Trimmed tree:" )
    tree.print()

    t.pass()
} )