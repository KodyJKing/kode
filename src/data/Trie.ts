export default class Trie<K, V> {

    children: Map<K, Trie<K, V>>
    value: V | undefined

    constructor() {
        this.children = new Map<K, Trie<K, V>>()
    }

    getChild( key: K, force = false ) {
        let result = this.children.get( key )
        if ( result === undefined && force ) {
            result = new Trie()
            this.children.set( key, result )
        }
        return result
    }

    getNode( key: K[], force = false ) {
        let node = this as Trie<K, V>
        for ( let part of key ) {
            node = node.getChild( part, force ) as Trie<K, V>
            if ( node === undefined )
                return undefined
        }
        return node
    }

    get( key: K[] ) {
        let node = this.getNode( key )
        return node === undefined ?
            undefined :
            node.value
    }

    set( key: K[], value: V ) {
        let node = this.getNode( key, true ) as Trie<K, V>
        node.value = value
    }

    *getSuffixes( key: K[] ) {
        let node = this.getNode( key )
        let path = key.slice()
        if ( node !== undefined )
            yield* node.suffixes( path )
    }

    *suffixes( path: K[] = [] ): IterableIterator<[ K[], V ]> {
        for ( let [ key, value ] of this.children.entries() ) {
            path.push( key )
            yield* value.suffixes( path )
            path.pop()
        }

        if ( this.value !== undefined )
            yield [ path.slice(), this.value ]
    }

}