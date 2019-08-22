import test from "ava"
import Trie from "./Trie";

test( "Trie", t => {
    let trie = new Trie<string, string>()

    trie.set(
        "fire water air".split( " " ),
        "sauna"
    )

    trie.set(
        "fire water rock".split( " " ),
        "hot tub"
    )

    let v = trie.get( "fire water air".split( " " ) )
    console.log( v )

    v = trie.get( "fire water rock".split( " " ) )
    console.log( v )

    for ( let entry of trie.suffixes() )
        console.log( entry )

    t.pass()
} )