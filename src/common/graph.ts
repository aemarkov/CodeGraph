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

interface Vertex<DEdge, DVertex> {
    inbound: Edge<DVertex, DEdge>,
    outbound: Edge<DVertex, DEdge>
};

interface Edge<DVertex, DEdge> {
    edge: DEdge,
    from: DVertex,
    to: DVertex
};

/**
 * General directed graph structure.
 */
export class Graph<DVertex, DEdge>
{
    private _vertices: Map<DVertex, Edge<DVertex, DEdge>[]>;
    private _edges: Map<DEdge, Edge<DVertex, DEdge>>;

    public constructor() {
        this._vertices = new Map<DVertex, Edge<DVertex, DEdge>[]>();
        this._edges = new Map<DEdge, Edge<DVertex, DEdge>>();
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
        const vFrom = this.getVertex(from);    // check if exists
        const vTo = this.getVertex(to);        // check if exists

        if (this._edges.has(id)) {
            throw new Error(`Edge with descriptor ${id} already exists`);
        }

        // NOTE: if don't want multiple edges between same vertices, it is
        // possible to use Set<Edge<...>> instead of Edge<...>[]

        const edge = {
            edge: id,
            from: from,
            to: to
        };

        vFrom.push(edge);
        this._edges.set(id, edge);
    }

    /**
     * Remove vertex from graph
     * O(E)
     * @param vertex vertex descriptor
     */
    public removeVertex(vertex: DVertex) {

    }

    /**
     * Remove edges from graph
     * O(M)
     * @param id edge descriptor
     */
    public removeEdge(id: DEdge) {
        const edge = this.getEdge(id);
        remove(this.getVertex(edge.from), edge);
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
    public edges(): Iterable<Edge<DVertex>> {
        return this.edgesGenerator();
    }

    private* edgesGenerator() {
        for (const [from, edges] of this._vertices.entries()) {
            for (const to of edges) {
                yield [from, to]
            }
        }
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

    }

    /**
     * Return all outgoing edges
     * @param vertex    vertex descriptor
     * @returns         iterator of all outgoing edge descriptors
     */
    public inEdges(vertex: DVertex): Iterable<DEdge> {
        // NOTE: iterate twice, once map, once in a client code
        return this.getVertex(vertex).in.map(x => x.id);    // O(M)
    }

    /**
     * Return all ingoing edges
     * @param vertex    vertex descriptor
     * @returns         iterator of all ingoing edge descriptors
     */
    public outEdges(vertex: VertexDescriptor): Iterable<EdgeDescriptor> {
        // NOTE: iterate twice, once map, once in a client code
        return this.getVertex(vertex).out.map(x => x.id);   // O(M)
    }

    /**
     * Return vertices are connected by edge
     * @param edge      edge descriptor
     * @returns         tuple <outgoing vertex, ingoing vertex>
     */
    public edgeNodes(edge: EdgeDescriptor): [VertexDescriptor, VertexDescriptor] {
        const edge_ = this.getEdge(edge);
        return [edge_.from, edge_.to];
    }

    private getVertex(vertex: DVertex): Edge<DVertex, DEdge>[] {
        let vertex_ = this._vertices.get(vertex);
        if (vertex_ === undefined) {
            throw Error(`Vertex ${vertex} doesn't exist`);
        }
        return vertex_;
    }

    private getEdge(edge: DEdge): Edge<DVertex, DEdge> {
        let edge_ = this._edges.get(edge);
        if (edge_ === undefined) {
            throw Error(`Edge ${edge} doesn't exist`);
        }
        return edge_;
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
