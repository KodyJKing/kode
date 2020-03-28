import test from "ava"
import PartitionTree from "./PartitionTree"

test( "PartitionTree", t => {
    let tree = new PartitionTree<number>( 0, 2 ** 10 )
    for ( let i = 0; i < 11; i++ )
        tree.set( i, 0 )
    tree.print()
    t.pass()
} )