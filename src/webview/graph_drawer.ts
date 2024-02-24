import { fabric } from 'fabric';
import Node from './node';
import Edge from './edge';
import { Graph, VertexDescriptor, EdgeDescriptor } from '../common/graph';
import * as access from '../common/util/access';

export default class GraphDrawer {
    private canvas: fabric.Canvas;
    private graph: Graph<Node, Edge>;
    private nodes: Map<string, VertexDescriptor>;

    constructor(canvas: fabric.Canvas) {
        this.canvas = canvas;
        this.graph = new Graph();
        this.nodes = new Map<string, VertexDescriptor>();

        canvas.on('object:moving', e => {
            const p = e.target;
            if (p === undefined) {
                return;
            }

            const v = access.forceGet<fabric.Object, VertexDescriptor>(p, 'node');
            const nodePos = this.graph.vertexGet(v).getPosition();
            for (const e of this.graph.outEdges(v)) {
                const edge = this.graph.edgeGet(e);
                edge.setFromPosition(nodePos);
            }

            for (const e of this.graph.inEdges(v)) {
                const edge = this.graph.edgeGet(e);
                edge.setToPosition(nodePos);
            }

            canvas.renderAll();
        });
    }

    addNode(node: Node) {
        const obj = node.getObject();
        const v = this.graph.addVertex(node);
        access.forceSet(obj, 'node', v);
        this.nodes.set(node.getId(), v);
        this.canvas.add(obj);
        this.canvas.bringToFront(obj);
    }

    addEdge(node1: Node, node2: Node, edge: Edge) {
        const obj = edge.getObject();
        const v1 = this.nodes.get(node1.getId())!;
        const v2 = this.nodes.get(node2.getId())!;
        const e = this.graph.addEdge(v1, v2, edge);
        access.forceSet(obj, 'edge', e);
        this.canvas.add(obj);
        this.canvas.sendToBack(obj);
    }
};
