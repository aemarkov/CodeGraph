import './css/index.css';

import { fabric } from 'fabric';
import { createCanvas } from './drawing_utils';
import Node from './node';
import Edge from './edge';
import GraphDrawer from './graph_drawer';
import * as newtype from '../common/util/newtype';
import * as id from '../common/id';

console.log('[codegraph] starting webview');

const canvas = createCanvas();
const graphDrawer = new GraphDrawer(canvas);

const node1 = new Node(newtype.to<id.NodeId>(1), "Node1");
node1.setPosition(new fabric.Point(100, 100));

const node2 = new Node(newtype.to<id.NodeId>(2), "Node2");
node2.setPosition(new fabric.Point(200, 100));

const node3 = new Node(newtype.to<id.NodeId>(3), "Node3");
node3.setPosition(new fabric.Point(100, 200));

const node4 = new Node(newtype.to<id.NodeId>(4), "Node4");
node4.setPosition(new fabric.Point(200, 200));

const e12 = new Edge(newtype.to<id.ReferenceId>(1));
const e13 = new Edge(newtype.to<id.ReferenceId>(2));
const e24 = new Edge(newtype.to<id.ReferenceId>(3));
const e34 = new Edge(newtype.to<id.ReferenceId>(4));

graphDrawer.addNode(node1);
graphDrawer.addNode(node2);
graphDrawer.addNode(node3);
graphDrawer.addNode(node4);
graphDrawer.addEdge(node1, node2, e12);
graphDrawer.addEdge(node1, node3, e13);
graphDrawer.addEdge(node2, node4, e24);
graphDrawer.addEdge(node3, node4, e34);
