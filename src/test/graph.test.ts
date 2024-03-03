import * as assert from 'assert';
import { Graph } from '../common/graph';

function createGraph() {
    // Diamond-like graph
    let graph = new Graph<number, number>();
    [0, 1, 2, 3].map(x => graph.addVertex(x));
    graph.addEdge(0, 1, 0);
    graph.addEdge(0, 2, 1);
    graph.addEdge(1, 3, 2);
    graph.addEdge(2, 3, 3);

    return {
        graph: graph,
        v0: 0,
        v1: 1,
        v2: 2,
        v3: 3,
        e01: 0,
        e02: 1,
        e13: 2,
        e23: 3,
    };
}

suite('graph', () => {
    test('addVertex/single/positive', () => {
        let graph = new Graph<number, number>();
        graph.addVertex(0);

        // check vertices
        assert.deepEqual(Array.from(graph.vertices()), [0]);

        // check nodes
        assert.deepEqual(Array.from(graph.edges()), []);
    });

    test('addVertex/multiple/positive', () => {
        let graph = new Graph<number, number>();
        graph.addVertex(0);
        graph.addVertex(1);
        graph.addVertex(2);

        // check vertices
        assert.deepEqual(Array.from(graph.vertices()), [0, 1, 2]);

        // check nodes
        assert.deepEqual(Array.from(graph.edges()), []);
    });

    test('addEdge/positive', () => {
        let graph = new Graph<number, number>();
        graph.addVertex(0);
        graph.addVertex(1);
        graph.addEdge(0, 1, 0);

        // check vertices
        assert.deepEqual(Array.from(graph.vertices()), [0, 1]);

        // check nodes
        assert.deepEqual(Array.from(graph.edges()), [0]);
    });

    test('addEdge/negative', () => {
        let graph = new Graph<number, number>();
        graph.addVertex(0);
        assert.throws(() => graph.addEdge(0, 1, 0), Error);
    });

    test('invAdjacentVertices/positive', () => {
        console.log('Running test');
        const g = createGraph();
        assert.deepEqual(Array.from(g.graph.invAdjacentVertices(g.v0)), []);
        assert.deepEqual(Array.from(g.graph.invAdjacentVertices(g.v1)), [g.v0]);
        assert.deepEqual(Array.from(g.graph.invAdjacentVertices(g.v2)), [g.v0]);
        assert.deepEqual(Array.from(g.graph.invAdjacentVertices(g.v3)), [g.v1, g.v2]);
    });

    test('invAdjacentVertices/negative', () => {
        let graph = new Graph<number, number>();
        assert.throws(() => graph.invAdjacentVertices(0), Error);
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
        assert.throws(() => graph.adjacentVertices(0), Error);
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
        assert.throws(() => graph.outEdges(0), Error);
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
        assert.throws(() => graph.inEdges(0), Error);
    });

    test('removeVertex/positive', () => {
        const g = createGraph();
        g.graph.removeVertex(g.v1);

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
        graph.addVertex(0);
        graph.removeVertex(0);

        assert.deepEqual(Array.from(graph.vertices()), []);
        assert.deepEqual(Array.from(graph.edges()), []);
    });

    test('removeVertex/negative', () => {
        let graph = new Graph<number, number>();
        assert.throws(() => graph.removeVertex(0), Error);
    });

    test('removeEdge/positive', () => {
        const g = createGraph();

        g.graph.removeEdge(g.e01);

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
        graph.addVertex(0);
        graph.addVertex(1);
        graph.addEdge(0, 1, 0);
        graph.removeEdge(0);

        assert.deepEqual(Array.from(graph.vertices()), [0, 1]);
        assert.deepEqual(Array.from(graph.edges()), []);
    });

    test('removeEdge/negative', () => {
        let graph = new Graph<number, number>();
        assert.throws(() => graph.removeEdge(0), Error);
    });
});
