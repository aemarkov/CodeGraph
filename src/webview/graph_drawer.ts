import { fabric } from 'fabric';
import Node from './node';
import Edge from './edge';
import { Graph } from '../common/graph';
import * as id from '../common/id';
import * as access from '../common/util/access';

export default class GraphDrawer {
    private canvas: fabric.Canvas;
    private graph: Graph<id.NodeId, id.ReferenceId>;
    private nodes: Map<id.NodeId, Node>;
    private edges:  Map<id.ReferenceId, Edge>;

    constructor(canvas: fabric.Canvas) {
        this.canvas = canvas;
        this.graph = new Graph();
        this.nodes = new Map();
        this.edges = new Map();

        canvas.on('object:moving', e => {
            const p = e.target;
            if (p === undefined) {
                return;
            }

            const v = access.forceGet<fabric.Object, id.NodeId>(p, 'node');
            const nodePos = this.nodes.get(v)!.getPosition();

            for (const e of this.graph.outEdges(v)) {
                const edge = this.edges.get(e)!;
                edge.setFromPosition(nodePos);
            }

            for (const e of this.graph.inEdges(v)) {
                const edge = this.edges.get(e)!;
                edge.setToPosition(nodePos);
            }

            canvas.renderAll();
        });
    }

    addNode(node: Node) {
        this.graph.addVertex(node.getId());
        this.nodes.set(node.getId(), node);
        const obj = node.getObject();
        this.canvas.add(obj);
        this.canvas.bringToFront(obj);
    }

    addEdge(node1: Node, node2: Node, edge: Edge) {
        this.graph.addEdge(node1.getId(), node2.getId(), edge.getId());
        this.edges.set(edge.getId(), edge);
        edge.setFromPosition(node1.getPosition());
        edge.setToPosition(node2.getPosition());
        const obj = edge.getObject();
        this.canvas.add(obj);
        this.canvas.sendToBack(obj);
    }
};
