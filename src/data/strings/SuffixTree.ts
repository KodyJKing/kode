import MultiMap from "../MultiMap";

class Node {
    children: { [name: string]: Node } | number
    start: number
    end: number
    constructor(start: number, end: number) {
        this.children = {}
        this.start = start
        this.end = end
    }
    isLeaf() { return typeof this.children == "number" }
}

const NULL = "\u0000"

export default class SuffixTree {
    content: string
    root: Node

    constructor(content) {
        this.content = content
        this.root = new Node(0, content.length)
    }

    buildTree() {
        let leafParents = new MultiMap<String, Node>()
        for (let i = 0; i < this.content.length; i++) {
            let char = this.content[i]
            
        }
    }

}