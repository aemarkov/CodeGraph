/**
 * This modules defines a general directed graph structure.
 *
 * Notes on implementation:
 * There are many ways to implement a graph, so I choose the most weird.
 * It's a well-known adjacency list, but vertices stored in the Map instead of
 * array because it's vertices can be removed. Because edge can also store data,
 * adjacency list doesn't store VertexDescriptors of vertex's neighbors,
 * instead it stores Edge objects. Also, each Edge object stored in a separate
 * edges map. It's only used to check if edge accessed belongs to this graph
 * instance.
 *
 * Interface is inspired by Boost Graph Library
 *
 * Possible modifications:
 *  - store EdgeDescriptor instead of Edge in each Vertex.
 *      pros: more pure
 *      cons: extra map lookup for each neighbor access
 *
 *  - store Vertex instead of VertexDescriptor in each Edge
 *      pros: no map lookup at all for neighbor access
 *      cons: more cross-references, asymmetric interface (vertex enumeration returns
 *            VertexDescriptor, but neighbors/edges enumeration returns Edges objects)
 *
 *  - previous one + remove edges map
 *      pros: previous one + less memory consumptions
 *      cons: previous one + can't check if edge belongs to this graph instance.
 *
 *  - store user context in the Vertex/Edge descriptor
 *      pros: no map lookup to get context, no getters/setters
 *      cons: Not so clean, also I don't know how to work with HashMap in this case
 *
 *  Definitions:
 *   - N - number of vertices
 *   - E - number of edges
 *   - M - number of ingoing/outgoing edges of given vertex
 */

import * as newtype from './util/newtype';
import * as util from 'util';

export interface Edge<DVertex> {
    from: DVertex,
    to: DVertex
};

/**
 * General directed graph structure.
 */
export class Graph<DVertex, DEdge>
{
    private _vertices: Map<DVertex, DVertex[]>;
    private _reverseVertices: Map<DVertex, DVertex[]>;
    private _edges: Map<DEdge, Edge<DVertex>>;
    private _reverseEdges: Map<Edge<DVertex>, DEdge>;

    public constructor() {
        this._vertices = new Map();
        this._reverseVertices = new Map();
        this._edges = new Map();
        this._reverseEdges = new Map();
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
            from: from,
            to: to
        };

        vFrom.push(to);
        vTo.push(from);
        this._edges.set(id, edge);
        this._reverseEdges.set(edge, id);
    }

    /**
     * Remove vertex from graph
     * O(E)
     * @param vertex vertex descriptor
     */
    public removeVertex(vertex: DVertex) {
        const vFrom = this.getVertex(vertex);

        for (const vRev of vFrom) {
            const edge = {
                from: vertex,
                to: vRev
            };
            const edgeId = this._reverseEdges.get(edge)!;
            this._edges.delete(edgeId);
            this._reverseEdges.delete(edge);

            const vTo = this._reverseVertices.get(vRev)!;
            remove(vTo, vertex);
        }

        this._vertices.delete(vertex);
    }

    /**
     * Remove edges from graph
     * O(M)
     * @param id edge descriptor
     */
    public removeEdge(id: DEdge) {
        const edge = this.getEdge(id);
        remove(this._vertices.get(edge.from)!, edge.to);
        remove(this._reverseVertices.get(edge.to)!, edge.from);
        this._edges.delete(id);
        this._reverseEdges.delete(edge);
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
     * @param vertex    vertex descriptor
     * @returns         iterator of all adjacent vertex descriptors
     */
    public adjacentVertices(vertex: DVertex): Iterable<DVertex> {
        return this.getVertex(vertex);
    }

    /**
     * Return all vertices given vertex is connected to by ingoing edges
     * u -> vertex
     * @param vertex    vertex descriptor
     * @returns         iterator of all adjacent vertex descriptors
     */
    public invAdjacentVertices(vertex: DVertex): Iterable<DVertex> {
        return this.getReverseVertex(vertex);
    }

    /**
     * Return all outgoing edges
     * @param vertex    vertex descriptor
     * @returns         iterator of all outgoing edge descriptors
     */
    public inEdges(vertex: DVertex): Iterable<DEdge> {
        // NOTE: iterate twice, once map, once in a client code
        const vFrom = this.getReverseVertex(vertex);
        return vFrom.map(x=>this._reverseEdges.get({from: x, to: vertex})!);
    }

    /**
     * Return all ingoing edges
     * @param vertex    vertex descriptor
     * @returns         iterator of all ingoing edge descriptors
     */
    public outEdges(vertex: DVertex): Iterable<DEdge> {
        // NOTE: iterate twice, once map, once in a client code
        const vTo = this.getVertex(vertex);
        console.log(`from: ${vertex}, to ${util.inspect(vTo)}`);
        for (const x of vTo) {
            const edge = {from: vertex, to: x};
            const e = this._reverseEdges.get(edge);
            console.log(`${util.inspect(edge)} -> ${e}`);
        }
        return vTo.map(x=>this._reverseEdges.get({from: vertex, to: x})!);
    }

    /**
     * Return vertices are connected by edge
     * @param edge      edge descriptor
     * @returns         tuple <outgoing vertex, ingoing vertex>
     */
    public edgeNodes(edge: DEdge): Edge<DVertex> {
        return this.getEdge(edge);
    }

    private getVertexImpl(vertices: Map<DVertex, DVertex[]>, vertex: DVertex): DVertex[] {
        let vertex_ = vertices.get(vertex);
        if (vertex_ === undefined) {
            throw Error(`Vertex ${vertex} doesn't exist`);
        }
        return vertex_;
    }

    private getVertex(vertex: DVertex): DVertex[] {
        return this.getVertexImpl(this._vertices, vertex);
    }

    private getReverseVertex(vertex: DVertex): DVertex[] {
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
            console.log(`${k}: ${util.inspect(v)}`)
        }

        console.log('Reverse vertexes:');
        for (const [k, v] of this._reverseVertices.entries()) {
            console.log(`${k}: ${util.inspect(v)}`)
        }

        console.log('Edges:');
        for (const [k, v] of this._edges.entries()) {
            console.log(`${k}: ${util.inspect(v)}`)
        }

        console.log('Reverse edges:');
        for (const [k, v] of this._reverseEdges.entries()) {
            console.log(`${util.inspect(k)}: ${v}`)
        }
    }
};

function remove<T>(arr: T[], object: T): boolean {
    const idx = arr.indexOf(object);
    if (idx == -1) {
        return false;
    }

    arr.splice(idx, 1);
    return true;
}
