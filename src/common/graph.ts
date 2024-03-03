/**
 * This modules defines a general directed graph structure.
 *
 * Notes on implementation:
 * There are many ways to implement a graph, so I choose the most weird.
 * It's a well-known adjacency list, but with some details:
 *  - vertices stored as Map instead of list because vertex IDs a provided by
 *    external code and vertexes can be removed
 *  - reverseVertices map is added to list inbound connections of the vertex
 *  - vertices/reverseVertices stores not vertex ID but object SEdge. It's used
 *    to get EdgeId by vertex and remove edge from edges map.
 *  - edge map is used to map EdgeId to vertices IDs (from - to)
 *
 * Interface is inspired by Boost Graph Library
 *
 *  Definitions:
 *   - N - number of vertices
 *   - E - number of edges
 *   - M - number of ingoing/outgoing edges of given vertex
 */

import * as util from 'util';

/**
 * Edge - pair of source and destination vertexes.
 */
export interface Edge<DVertex> {
    from: DVertex,
    to: DVertex
};

interface SEdge<DVertex, DEdge> {
    id: DEdge,
    from: DVertex,
    to: DVertex,
};

interface SVertex<DVertex, DEdge> {
    inbound: SEdge<DVertex, DEdge>[],
    outbound: SEdge<DVertex, DEdge>[],
}

/**
 * General directed graph structure.
 */
export class Graph<DVertex, DEdge>
{
    private _vertices: Map<DVertex, SEdge<DVertex, DEdge>[]>;
    private _reverseVertices: Map<DVertex, SEdge<DVertex, DEdge>[]>;
    private _edges: Map<DEdge, SEdge<DVertex, DEdge>>;

    public constructor() {
        this._vertices = new Map();
        this._reverseVertices = new Map();
        this._edges = new Map();
    }

    /**
     * Add vertex to the graph
     * O(1)
     * @param id        new vertex descriptor
     * @param context   user-defined data to store in the vertex
     */
    public addVertex(id: DVertex) {
        if (this._vertices.get(id) !== undefined) {
            throw new Error(`Vertex ${id} already exists`);
        }

        this._vertices.set(id, []);
        this._reverseVertices.set(id, []);
    }

    /**
     * Add edge between two vertices to graph
     * O(1)
     * @param from      source vertex descriptor
     * @param to        destination vertex descriptor
     * @param id        new edge descriptor
     * @param context   user-defined data to store in the edge
     */
    public addEdge(from: DVertex, to: DVertex, id: DEdge) {
        const vFrom = this.getVertex(from);     // check if exists
        const vTo = this.getReverseVertex(to);  // check if exists

        if (this._edges.has(id)) {
            throw new Error(`Edge with descriptor ${id} already exists`);
        }

        const edge = {
            id: id,
            from: from,
            to: to
        };

        vFrom.push(edge);
        vTo.push(edge);
        this._edges.set(id, edge);
    }

    /**
     * Remove vertex from graph
     * ~O(M)
     * @param id    vertex descriptor
     */
    public removeVertex(id: DVertex) {
        const vFrom = this.getVertex(id);
        const vTo = this._reverseVertices.get(id)!;

        // delete outbound edges
        for (const eOut of vFrom) {
            const vTo = this._reverseVertices.get(eOut.to)!;
            remove(vTo, eOut);
            this._edges.delete(eOut.id);
        }

        for (const eIn of vTo) {
            const vFrom = this._vertices.get(eIn.from)!;
            remove(vFrom, eIn);
            this._edges.delete(eIn.id);
        }

        this._vertices.delete(id);
        this._reverseVertices.delete(id);
    }

    /**
     * Remove edges from graph
     * ~O(M)
     * @param id    edge descriptor
     */
    public removeEdge(id: DEdge) {
        const edge = this.getEdge(id);
        const vFrom = this._vertices.get(edge.from)!;
        const vTo = this._reverseVertices.get(edge.to)!;
        remove(vFrom, edge);
        remove(vTo, edge);
        this._edges.delete(id);
    }

    /**
     * @returns iterator of all vertices
     */
    public vertices(): Iterable<DVertex> {
        return this._vertices.keys();
    }

    /**
     * @returns iterator of all edges
     */
    public edges(): Iterable<DEdge> {
        return this._edges.keys();
    }

    /**
     * Return all vertices given vertex is connected to by outgoing edges
     * vertex -> u
     * @param id    vertex descriptor
     * @returns     iterator of all adjacent vertex descriptors
     */
    public adjacentVertices(id: DVertex): Iterable<DVertex> {
        // NOTE: iterate twice, once map, once in a client code
        return this.getVertex(id).map(x => x.to);
    }

    /**
     * Return all vertices given vertex is connected to by ingoing edges
     * u -> vertex
     * @param id    vertex descriptor
     * @returns     iterator of all adjacent vertex descriptors
     */
    public invAdjacentVertices(id: DVertex): Iterable<DVertex> {
        // NOTE: iterate twice, once map, once in a client code
        return this.getReverseVertex(id).map(x => x.from);
    }

    /**
     * Return all outgoing edges
     * @param id    vertex descriptor
     * @returns     iterator of all outgoing edge descriptors
     */
    public inEdges(id: DVertex): Iterable<DEdge> {
        // NOTE: iterate twice, once map, once in a client code
        const vFrom = this.getReverseVertex(id);
        return vFrom.map(x => x.id);
    }

    /**
     * Return all ingoing edges
     * @param id    vertex descriptor
     * @returns     iterator of all ingoing edge descriptors
     */
    public outEdges(id: DVertex): Iterable<DEdge> {
        // NOTE: iterate twice, once map, once in a client code
        const vTo = this.getVertex(id);
        return vTo.map(x => x.id);
    }

    /**
     * Return vertices are connected by edge
     * @param id    edge descriptor
     * @returns     Edge object
     */
    public edgeNodes(id: DEdge): Edge<DVertex> {
        return this.getEdge(id);
    }

    private getVertexImpl(
        vertices: Map<DVertex, SEdge<DVertex, DEdge>[]>,
        vertex: DVertex): SEdge<DVertex, DEdge>[] {
        let vertex_ = vertices.get(vertex);
        if (vertex_ === undefined) {
            throw Error(`Vertex ${vertex} doesn't exist`);
        }
        return vertex_;
    }

    private getVertex(vertex: DVertex): SEdge<DVertex, DEdge>[] {
        return this.getVertexImpl(this._vertices, vertex);
    }

    private getReverseVertex(vertex: DVertex): SEdge<DVertex, DEdge>[] {
        return this.getVertexImpl(this._reverseVertices, vertex);
    }

    private getEdge(edge: DEdge): Edge<DVertex> {
        let edge_ = this._edges.get(edge);
        if (edge_ === undefined) {
            throw Error(`Edge ${edge} doesn't exist`);
        }
        return edge_;
    }

    public debug() {
        console.log('debug');
        console.log('Vertices:');
        for (const [k, v] of this._vertices.entries()) {
            console.log(`${k}: ${util.inspect(v)}`);
        }

        console.log('Reverse vertexes:');
        for (const [k, v] of this._reverseVertices.entries()) {
            console.log(`${k}: ${util.inspect(v)}`);
        }

        console.log('Edges:');
        for (const [k, v] of this._edges.entries()) {
            console.log(`${k}: ${util.inspect(v)}`);
        }
    }
};

function remove<T>(arr: T[], object: T): boolean {
    const idx = arr.indexOf(object);
    if (idx === -1) {
        return false;
    }

    arr.splice(idx, 1);
    return true;
}
