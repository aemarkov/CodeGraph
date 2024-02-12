import { fabric } from 'fabric';
import { Style, getDefaultStyle, setControls } from './drawing_utils';

const FONT_SIZE = 14;
const NODE_PADDING = 8;

/**
 * Graph node - represents a single symbol
 */
export default class Node {
    group: fabric.Group;
    text: fabric.Text;
    rect: fabric.Rect;

    constructor(
        private id: number,
        private name: string) {
        const style = getDefaultStyle();

        this.text = new fabric.Text(this.name, {
            originX: 'center',
            originY: 'center',
            fontSize: FONT_SIZE,
            fontFamily: style.fontFamily,
            fill: style.fontColor,
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
