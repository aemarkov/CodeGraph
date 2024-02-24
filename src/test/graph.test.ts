import * as assert from 'assert';
import { Graph, EdgeDescriptor, VertexDescriptor } from '../common/graph';
import * as newtype from '../common/util/newtype';

function createGraph() {
    // Diamond-like graph
    let graph = new Graph<number, number>();
    const v = [0, 1, 2, 3].map(x => graph.addVertex(x));

    return {
        graph: graph,
        v0: v[0],
        v1: v[1],
        v2: v[2],
        v3: v[3],
        e01: graph.addEdge(v[0], v[1], 0),
        e02: graph.addEdge(v[0], v[2], 1),
        e13: graph.addEdge(v[1], v[3], 2),
        e23: graph.addEdge(v[2], v[3], 3),
    };
}

suite('graph', () => {
    test('addVertex/single/positive', () => {
        let graph = new Graph<number, number>();
        const v1 = graph.addVertex(1);

        // check get
        assert.equal(graph.vertexGet(v1), 1);

        // check vertices
        assert.deepEqual(Array.from(graph.vertices()), [v1]);

        // check nodes
        assert.deepEqual(Array.from(graph.edges()), []);
    });

    test('addVertex/multiple/positive', () => {
        let graph = new Graph<number, number>();
        const v1 = graph.addVertex(1);
        const v2 = graph.addVertex(2);
        const v3 = graph.addVertex(3);

        // check get
        assert.equal(graph.vertexGet(v1), 1);
        assert.equal(graph.vertexGet(v2), 2);
        assert.equal(graph.vertexGet(v3), 3);

        // check vertices
        assert.deepEqual(Array.from(graph.vertices()), [v1, v2, v3]);

        // check nodes
        assert.deepEqual(Array.from(graph.edges()), []);
    });

    test('vertexGet/negative', () => {
        let graph = new Graph<number, number>();
        const v2 = newtype.to<VertexDescriptor>(123); // fake vertex descriptor

        assert.throws(() => graph.vertexGet(v2), ReferenceError);
    });

    test('vertexSet/positive', () => {
        let graph = new Graph<number, number>();
        const v1 = graph.addVertex(1);

        assert.equal(graph.vertexGet(v1), 1);
        graph.vertexSet(v1, 2);
        assert.equal(graph.vertexGet(v1), 2);
    });

    test('vertexSet/negative', () => {
        let graph = new Graph<number, number>();
        const v1 = newtype.to<VertexDescriptor>(123); // fake vertex descriptor

        assert.throws(() => graph.vertexSet(v1, 2), ReferenceError);
    });

    test('addEdge/positive', () => {
        let graph = new Graph<number, number>();
        const v1 = graph.addVertex(1);
        const v2 = graph.addVertex(2);
        const e1 = graph.addEdge(v1, v2, 10);

        // check get vertex value
        assert.equal(graph.vertexGet(v1), 1);
        assert.equal(graph.vertexGet(v2), 2);

        // check get edge value
        assert.equal(graph.edgeGet(e1), 10);

        // check vertices
        assert.deepEqual(Array.from(graph.vertices()), [v1, v2]);

        // check nodes
        assert.deepEqual(Array.from(graph.edges()), [e1]);
    });

    test('edgeGet/negative', () => {
        let graph = new Graph<number, number>();
        const e1 = newtype.to<EdgeDescriptor>(123); // fake edge descriptor

        assert.throws(() => graph.edgeGet(e1), ReferenceError);
    });

    test('edgeSet/positive', () => {
        let graph = new Graph<number, number>();
        const v1 = graph.addVertex(1);
        const v2 = graph.addVertex(2);
        const e1 = graph.addEdge(v1, v2, 10);

        assert.equal(graph.edgeGet(e1), 10);
        graph.edgeSet(e1, 20);
        assert.equal(graph.edgeGet(e1), 20);
    });

    test('edgeSet/negative', () => {
        let graph = new Graph<number, number>();
        const e1 = newtype.to<EdgeDescriptor>(123); // fake edge descriptor

        assert.throws(() => graph.edgeSet(e1, 2), ReferenceError);
    });

    test('addEdge/negative', () => {
        let graph = new Graph<number, number>();
        const v1 = graph.addVertex(1);
        const v2 = newtype.to<VertexDescriptor>(123); // fake vertex descriptor

        assert.throws(() => graph.addEdge(v1, v2, 1), ReferenceError);
    });

    test('invAdjacentVertices/positive', () => {
        const g = createGraph();
        assert.deepEqual(Array.from(g.graph.invAdjacentVertices(g.v0)), []);
        assert.deepEqual(Array.from(g.graph.invAdjacentVertices(g.v1)), [g.v0]);
        assert.deepEqual(Array.from(g.graph.invAdjacentVertices(g.v2)), [g.v0]);
        assert.deepEqual(Array.from(g.graph.invAdjacentVertices(g.v3)), [g.v1, g.v2]);
    });

    test('invAdjacentVertices/negative', () => {
        let graph = new Graph<number, number>();
        const v1 = newtype.to<VertexDescriptor>(123); // fake vertex descriptor
        assert.throws(() => graph.invAdjacentVertices(v1), ReferenceError);
    });

    test('adjacentVertices/positive', () => {
        const g = createGraph();
        assert.deepEqual(Array.from(g.graph.adjacentVertices(g.v0)), [g.v1, g.v2]);
        assert.deepEqual(Array.from(g.graph.adjacentVertices(g.v1)), [g.v3]);
        assert.deepEqual(Array.from(g.graph.adjacentVertices(g.v2)), [g.v3]);
        assert.deepEqual(Array.from(g.graph.adjacentVertices(g.v3)), []);
    });

    test('adjacentVertices/negative', () => {
        let graph = new Graph<number, number>();
        const v1 = newtype.to<VertexDescriptor>(123); // fake vertex descriptor
        assert.throws(() => graph.adjacentVertices(v1), ReferenceError);
    });

    test('outEdges/positive', () => {
        const g = createGraph();
        assert.deepEqual(Array.from(g.graph.outEdges(g.v0)), [g.e01, g.e02]);
        assert.deepEqual(Array.from(g.graph.outEdges(g.v1)), [g.e13]);
        assert.deepEqual(Array.from(g.graph.outEdges(g.v2)), [g.e23]);
        assert.deepEqual(Array.from(g.graph.outEdges(g.v3)), []);
    });

    test('outEdges/negative', () => {
        let graph = new Graph<number, number>();
        const v1 = newtype.to<VertexDescriptor>(123); // fake vertex descriptor
        assert.throws(() => graph.outEdges(v1), ReferenceError);
    });

    test('inEdges/positive', () => {
        const g = createGraph();
        assert.deepEqual(Array.from(g.graph.inEdges(g.v0)), []);
        assert.deepEqual(Array.from(g.graph.inEdges(g.v1)), [g.e01]);
        assert.deepEqual(Array.from(g.graph.inEdges(g.v2)), [g.e02]);
        assert.deepEqual(Array.from(g.graph.inEdges(g.v3)), [g.e13, g.e23]);
    });

    test('inEdges/negative', () => {
        let graph = new Graph<number, number>();
        const v1 = newtype.to<VertexDescriptor>(123); // fake vertex descriptor
        assert.throws(() => graph.inEdges(v1), ReferenceError);
    });

    test('removeVertex/positive', () => {
        const g = createGraph();
        g.graph.removeVertex(g.v1);

        assert.throws(() => g.graph.vertexGet(g.v1));

        assert.deepEqual(Array.from(g.graph.vertices()), [g.v0, g.v2, g.v3]);
        assert.deepEqual(Array.from(g.graph.edges()), [g.e02, g.e23]);

        assert.deepEqual(Array.from(g.graph.adjacentVertices(g.v0)), [g.v2]);
        assert.deepEqual(Array.from(g.graph.adjacentVertices(g.v2)), [g.v3]);
        assert.deepEqual(Array.from(g.graph.adjacentVertices(g.v3)), []);

        assert.deepEqual(Array.from(g.graph.outEdges(g.v0)), [g.e02]);
        assert.deepEqual(Array.from(g.graph.outEdges(g.v2)), [g.e23]);
        assert.deepEqual(Array.from(g.graph.outEdges(g.v3)), []);

        assert.deepEqual(Array.from(g.graph.inEdges(g.v0)), []);
        assert.deepEqual(Array.from(g.graph.inEdges(g.v2)), [g.e02]);
        assert.deepEqual(Array.from(g.graph.inEdges(g.v3)), [g.e23]);
    });

    test('removeVertex/single/positive', () => {
        let graph = new Graph<number, number>();
        const v0 = graph.addVertex(1);
        graph.removeVertex(v0);

        assert.deepEqual(Array.from(graph.vertices()), []);
        assert.deepEqual(Array.from(graph.edges()), []);
    });

    test('removeVertex/negative', () => {
        let graph = new Graph<number, number>();
        const v1 = newtype.to<VertexDescriptor>(123); // fake vertex descriptor

        assert.throws(() => graph.removeVertex(v1), ReferenceError);
    });

    test('removeEdge/positive', () => {
        const g = createGraph();
        g.graph.removeEdge(g.e01);

        assert.throws(() => g.graph.edgeGet(g.e01));

        assert.deepEqual(Array.from(g.graph.vertices()), [g.v0, g.v1, g.v2, g.v3]);
        assert.deepEqual(Array.from(g.graph.edges()), [g.e02, g.e13, g.e23]);

        assert.deepEqual(Array.from(g.graph.adjacentVertices(g.v0)), [g.v2]);
        assert.deepEqual(Array.from(g.graph.adjacentVertices(g.v1)), [g.v3]);
        assert.deepEqual(Array.from(g.graph.adjacentVertices(g.v2)), [g.v3]);
        assert.deepEqual(Array.from(g.graph.adjacentVertices(g.v3)), []);

        assert.deepEqual(Array.from(g.graph.outEdges(g.v0)), [g.e02]);
        assert.deepEqual(Array.from(g.graph.outEdges(g.v1)), [g.e13]);
        assert.deepEqual(Array.from(g.graph.outEdges(g.v2)), [g.e23]);
        assert.deepEqual(Array.from(g.graph.outEdges(g.v3)), []);

        assert.deepEqual(Array.from(g.graph.inEdges(g.v0)), []);
        assert.deepEqual(Array.from(g.graph.inEdges(g.v2)), [g.e02]);
        assert.deepEqual(Array.from(g.graph.inEdges(g.v3)), [g.e13, g.e23]);
    });

    test('removeEdge/single/positive', () => {
        let graph = new Graph<number, number>();
        const v0 = graph.addVertex(1);
        const v1 = graph.addVertex(2);
        const e01 = graph.addEdge(v0, v1, 1);
        graph.removeEdge(e01);

        assert.deepEqual(Array.from(graph.vertices()), [v0, v1]);
        assert.deepEqual(Array.from(graph.edges()), []);
    });

    test('removeEdge/negative', () => {
        let graph = new Graph<number, number>();
        const e1 = newtype.to<EdgeDescriptor>(123); // fake vertex descriptor

        assert.throws(() => graph.removeEdge(e1), ReferenceError);
    });
});
