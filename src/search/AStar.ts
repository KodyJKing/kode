import MaxHeap from "../data/MaxHeap"

type AStarProblem<S, K> = {
    getNeighbors: ( state: S ) => S[]
    getCost: ( a: S, b: S ) => number,
    getHeuristicCost: ( state: S ) => number,
    getKey: ( state: S ) => K
    isSolution: ( state: S ) => boolean
}

export function AStar<S, K>( problem: AStarProblem<S, K>, origin: S ) {
    let {
        getNeighbors,
        getCost,
        getHeuristicCost,
        getKey,
        isSolution
    } = problem

    let closed = new Set<K>()
    let nodes = new Map<K, Node<S>>()
    let openQueue = new MaxHeap<Node<S>>( ( a, b ) => b.expectedNetCost - a.expectedNetCost )

    function closeNode( node: Node<S> ) {
        let k = getKey( node.state )
        closed.add( k )
        nodes.delete( k )
        return node
    }

    function getNode( state: S ) {
        let k = getKey( state )
        if ( closed.has( k ) )
            return undefined
        let existingNode = nodes.get( k )
        if ( existingNode )
            return existingNode
        let node = new Node( state, getHeuristicCost( state ), Infinity )
        nodes.set( k, node )
        return node
    }

    function getPath( node: Node<S> ) {
        let path = [ node.state ]
        let cost = node.costFromOrigin
        while ( node.parent ) {
            path.push( node.parent.state )
            node = node.parent
        }
        return { path: path.reverse(), cost }
    }

    let bestNode: Node<S> | undefined = new Node( origin, getHeuristicCost( origin ), 0 )
    while ( true ) {
        if ( bestNode == undefined )
            return undefined
        if ( isSolution( bestNode.state ) )
            return getPath( bestNode )
        closeNode( bestNode )
        for ( let neighbor of getNeighbors( bestNode.state ) ) {
            let node = getNode( neighbor )
            if ( !node )
                continue
            let newCost = bestNode.costFromOrigin + getCost( bestNode.state, neighbor )
            if ( newCost < node.costFromOrigin ) {
                node.parent = bestNode
                node.costFromOrigin = newCost
                openQueue.push( node )
            }
        }
        bestNode = openQueue.pop()
    }

}

class Node<S> {
    parent?: Node<S>
    costFromOrigin: number
    heuristicCost: number
    state: S
    constructor( state: S, heuristicCost: number, costFromOrigin: number, parent?: Node<S> ) {
        this.costFromOrigin = costFromOrigin
        this.heuristicCost = heuristicCost
        this.state = state
        this.parent = parent
    }
    get expectedNetCost() {
        return this.costFromOrigin + this.heuristicCost
    }
}