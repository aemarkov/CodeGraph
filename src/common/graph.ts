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

// Edge representation
class Edge<TEdge> {
    public constructor(
        public id: EdgeDescriptor,
        public from: VertexDescriptor,  // Source vertex
        public to: VertexDescriptor,    // Destination vertex
        public context: TEdge,          // Optional user-defined data associated
                                        //  with edge
    ) {}
};

// Vertex representation
class Vertex<TVertex, TEdge> {
    public in: Edge<TEdge>[];           // List of inbound edges
    public out: Edge<TEdge>[];          // List of outbound edges
    public context: TVertex;            // Optional user-defined data associated
                                        //  with vertex

    public constructor(context: TVertex) {
        this.context = context;
        this.in = [];
        this.out = [];
    }
};

// Descriptor (IDs) generator
// Generates sequential numbers wrapped by NewType
class Descriptor<T extends newtype.NewType> {
    private value: number = 0;
    public new(): T {
        return newtype.to<T>(this.value++);
    }
};

/**
 * Vertex identifier
 */
export type VertexDescriptor = {
    value: number,
    readonly __tag: unique symbol
};

/**
 * Edge identifier
 */
export type EdgeDescriptor = {
    value: number,
    readonly __tag: unique symbol
};

/**
 * General directed graph structure.
 */
export class Graph<TVertex, TEdge>
{
    private _vertices: Map<VertexDescriptor, Vertex<TVertex, TEdge>>;
    private _edges: Map<EdgeDescriptor, Edge<TEdge>>;
    private vertexDesc: Descriptor<VertexDescriptor>;
    private edgeDesc: Descriptor<EdgeDescriptor>;

    public constructor() {
        this._vertices = new Map<VertexDescriptor, Vertex<TVertex, TEdge>>();
        this._edges = new Map<EdgeDescriptor, Edge<TEdge>>();
        this.vertexDesc = new Descriptor();
        this.edgeDesc = new Descriptor();
    }

    /**
     * Add vertex to the graph
     * O(1)
     * @param context   user-defined data to store in the vertex
     * @returns         vertex descriptor used to access graph
     */
    public addVertex(context: TVertex): VertexDescriptor {
        const vertex = new Vertex<TVertex, TEdge>(context);
        const descriptor = this.vertexDesc.new();
        this._vertices.set(descriptor, vertex); // O(1)
        return descriptor;
    }

    /**
     * Add edge between two vertices to graph
     * O(1)
     * @param from      source vertex
     * @param to        destination vertex
     * @param context   user-defined data to store in the edge
     * @returns         edge descriptor used to access graph
     */
    public addEdge(from: VertexDescriptor, to: VertexDescriptor, context: TEdge): EdgeDescriptor {
        let vertex1 = this.getVertex(from); // O(1)
        let vertex2 = this.getVertex(to);   // O(1)

        const descriptor = this.edgeDesc.new();
        const edge = new Edge(descriptor, from, to, context);
        this._edges.set(descriptor, edge); // O(1)

        vertex1.out.push(edge); // O(1)
        vertex2.in.push(edge);  // O(1)

        return descriptor;
    }

    /**
     * Remove vertex from graph
     * O(Min * Mi_out + Mout * Mi_in)
     * @param vertex vertex descriptor
     */
    public removeVertex(vertex: VertexDescriptor) {
        let vertex_ = this.getVertex(vertex);                   // O(1)

        // Delete all inbound and outbound edges of this vertex
        for (const edge of vertex_.in) {
            const outVertex = this._vertices.get(edge.from);    // O(1)
            remove(outVertex!.out, edge);                       // O(M)
            this._edges.delete(edge.id);                        // O(1)
        }

        for (const edge of vertex_.out) {
            const inVertex = this._vertices.get(edge.to);
            remove(inVertex!.in, edge);
            this._edges.delete(edge.id);
        }

        // Delete vertex from map
        this._vertices.delete(vertex);
    }

    /**
     * Remove edges from graph
     * O(Min + Mout)
     * @param edge edge descriptor
     */
    public removeEdge(edge: EdgeDescriptor) {
        let edge_  = this.getEdge(edge);                // O(1)

        // Remove edge from connected vertexes
        const from = this._vertices.get(edge_.from);    // O(1)
        remove(from!.out, edge_);                       // O(M)
        const to = this._vertices.get(edge_.to);        // O(1)
        remove(to!.in, edge_);                          // O(M)

        this._edges.delete(edge);
    }

    /**
     * @returns iterator of all vertices
     */
    public vertices(): Iterable<VertexDescriptor> {
        return this._vertices.keys();
    }

    /**
     * @returns iterator of all edges
     */
    public edges(): Iterable<EdgeDescriptor> {
        return this._edges.keys();
    }

    /**
     * Return all vertices given vertex is connected to by outgoing edges
     * vertex -> u
     * @param vertex    vertex descriptor
     * @returns         iterator of all adjacent vertex descriptors
     */
    public adjacentVertices(vertex: VertexDescriptor): Iterable<VertexDescriptor> {
        // NOTE: iterate twice, once map, once in a client code
        return this.getVertex(vertex).out.map(x => x.to);   // O(M)
    }

    /**
     * Return all vertices given vertex is connected to by ingoing edges
     * u -> vertex
     * @param vertex    vertex descriptor
     * @returns         iterator of all adjacent vertex descriptors
     */
    public invAdjacentVertices(vertex: VertexDescriptor): Iterable<VertexDescriptor> {
        // NOTE: iterate twice, once map, once in a client code
        return this.getVertex(vertex).in.map(x => x.from);  // O(M)
    }

    /**
     * Return all outgoing edges
     * @param vertex    vertex descriptor
     * @returns         iterator of all outgoing edge descriptors
     */
    public inEdges(vertex: VertexDescriptor): Iterable<EdgeDescriptor> {
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

    /**
     * Return user-defined context stored in the vertex
     * @param vertex    vertex descriptor
     * @returns         user-defined context
     */
    public vertexGet(vertex: VertexDescriptor): TVertex {
        return this.getVertex(vertex).context;
    }

    /**
     * Store user-defined context in the vertex
     * @param vertex  vertex descriptor
     * @param context user-defined context
     */
    public vertexSet(vertex: VertexDescriptor, context: TVertex) {
        this.getVertex(vertex).context = context;
    }

    /**
     * Return user-defined context stored in the edge
     * @param edge      edge descriptor
     * @returns         user-defined context
     */
    public edgeGet(edge: EdgeDescriptor): TEdge {
        return this.getEdge(edge).context;
    }

    /**
     * Store user-defined context in the edge
     * @param edge      edge descriptor
     * @param context   user-defined context
     */
    public edgeSet(edge: EdgeDescriptor, context: TEdge) {
        return this.getEdge(edge).context = context;
    }

    private getVertex(vertex: VertexDescriptor): Vertex<TVertex, TEdge> {
        let vertex_ = this._vertices.get(vertex);
        if (vertex_ === undefined) {
            throw ReferenceError(`Vertex ${vertex} doesn't exist`);
        }
        return vertex_;
    }

    private getEdge(edge: EdgeDescriptor): Edge<TEdge> {
        let edge_ = this._edges.get(edge);
        if (edge_ === undefined) {
            throw ReferenceError(`Edge ${edge} doesn't exist`);
        }
        return edge_;
    }
};

function remove<T>(arr: T[], object: T) {
    const idx = arr.indexOf(object);                // O(M)
    arr.splice(idx, 1);
}
