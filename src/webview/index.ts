import './css/index.css';

import { fabric } from 'fabric';
import { createCanvas } from './drawing_utils';
import Node from './node';
import Edge from './edge';
import GraphDrawer from './graph_drawer';

console.log('[codegraph] starting webview');

const canvas = createCanvas();
const graphDrawer = new GraphDrawer(canvas);

const node1 = new Node('1', "Node1");
node1.setPosition(new fabric.Point(100, 100));

const node2 = new Node('2', "Node2");
node2.setPosition(new fabric.Point(200, 100));

const node3 = new Node('3', "Node3");
node3.setPosition(new fabric.Point(100, 200));

const node4 = new Node('4', "Node4");
node4.setPosition(new fabric.Point(200, 200));

const e12 = new Edge('1', node1.getPosition(), node2.getPosition());
const e13 = new Edge('2', node1.getPosition(), node3.getPosition());
const e24 = new Edge('3', node2.getPosition(), node4.getPosition());
const e34 = new Edge('4', node3.getPosition(), node4.getPosition());

graphDrawer.addNode(node1);
graphDrawer.addNode(node2);
graphDrawer.addNode(node3);
graphDrawer.addNode(node4);
graphDrawer.addEdge(node1, node2, e12);
graphDrawer.addEdge(node1, node3, e13);
graphDrawer.addEdge(node2, node4, e24);
graphDrawer.addEdge(node3, node4, e34);
