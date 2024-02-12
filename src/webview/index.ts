import './css/index.css';

import { fabric } from 'fabric';

const FONT_SIZE = 14;
const NODE_PADDING = 8;

/**
 * CSS font properties
 */
interface FontStyle {
    size: number,
    family: string,
    color: string
};

/**
 * Graph node - represents a single symbol
 */
class Node {
    group: fabric.Group;
    text: fabric.Text;
    rect: fabric.Rect;

    constructor(
        private id: number,
        private name: string) {
        this.text = new fabric.Text(this.name, {
            originX: 'center',
            originY: 'center',
            fontSize: fontStyle.size,
            fontFamily: fontStyle.family,
            fill: fontStyle.color,
            selectable: false,
        });

        console.assert(this.text.width !== undefined && this.text.height !== undefined)

        this.rect = new fabric.Rect({
            width: this.text.width! + 2 * NODE_PADDING,
            height: this.text.height! + 2 * NODE_PADDING,
            originX: 'center',
            originY: 'center',
            fill: '#535C91',
            stroke: '#9290C3',
            selectable: false,
        })

        this.group = new fabric.Group([
            this.rect,
            this.text], {
                originX: 'center',
                originY: 'center',
            });

        setControls(this.group);
    }

    getObject(): fabric.Group {
        return this.group;
    }

    getPosition(): fabric.Point {
        return this.group.getCenterPoint();
    }

    setPosition(pos: fabric.Point) {
        this.group.set({
            left: pos.x,
            top: pos.y
        });

        this.group.setCoords();
    }

}

// Creates canvas
function createCanvas(): fabric.Canvas {
    const handleResize = () => {
        canvas.setWidth(window.innerWidth);
        canvas.setHeight(window.innerHeight);
        canvas.renderAll();
    };
    const canvas = new fabric.Canvas('graph');
    window.addEventListener('resize', (event) => handleResize());
    handleResize();
    return canvas;
}

// Get default font style from CSS
function getFontStyle(): FontStyle {
    const style = getComputedStyle(document.body);
    return {
        size: FONT_SIZE, // NOT WORKS: Number(style.getPropertyValue('font-size')),
        family: style.getPropertyValue('font-family'),
        color: style.getPropertyValue('color')
    };
}

// Disable scaling and rotation of the FabricJS object
function setControls(object: fabric.Object) {
    object.setControlsVisibility({
        bl: false,
        br: false,
        mb: false,
        ml: false,
        mr: false,
        mt: false,
        tl: false,
        tr: false,
        mtr: false,
    });
}

const canvas = createCanvas();
const fontStyle = getFontStyle();
console.log('Font style:', fontStyle);

const node1 = new Node(1, "Hello");
node1.setPosition(new fabric.Point(100, 100));
canvas.add(node1.getObject());


const node2 = new Node(2, "Some text");
node2.setPosition(new fabric.Point(200, 100));
canvas.add(node2.getObject());
