import './css/index.css';

import { fabric } from 'fabric';
import { createCanvas } from './drawing_utils';
import Node from './node';

const canvas = createCanvas();

const node1 = new Node(1, "Hello");
node1.setPosition(new fabric.Point(100, 100));
canvas.add(node1.getObject());


const node2 = new Node(2, "Some text");
node2.setPosition(new fabric.Point(200, 100));
canvas.add(node2.getObject());
