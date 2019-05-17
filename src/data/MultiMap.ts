export default class MultiMap<K, V> {
    private content: Map<K, Set<V>> = new Map<K, Set<V>>()

    keys() {
        return this.content.keys()
    }

    add(key: K, value: V) {
        let values = this.content.get(key)
        if (values == undefined) {
            values = new Set<V>()
            this.content.set(key, values)
        }
        values.add(value)
    }

    remove(key: K, value: V) {
        let values = this.content.get(key)
        if (values != undefined)
            values.delete(value)
    }

    removeAll(key: K) {
        this.content.delete(key)
    }
}