import { fabric } from 'fabric';
import { Style, getDefaultStyle, setControls } from './drawing_utils';
import { NodeId } from '../common/id';
import * as access from '../common/util/access';
import { assert } from 'console';

const FONT_SIZE = 14;
const NODE_PADDING = 8;

/**
 * Graph node is a visual representation of symbol.
 */
export default class Node {
    private group: fabric.Group;
    private text: fabric.Text;
    private rect: fabric.Rect;

    /**
     * Create new Node instance
     * @param id unique ID of the node
     * @param name name of the node, e.g. name of function or variable
     */
    constructor(
        private id: NodeId,
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

        console.assert(this.text.width !== undefined && this.text.height !== undefined);

        this.rect = new fabric.Rect({
            width: this.text.width! + 2 * NODE_PADDING,
            height: this.text.height! + 2 * NODE_PADDING,
            originX: 'center',
            originY: 'center',
            fill: '#535C91',
            stroke: '#9290C3',
            selectable: false,
        });

        this.group = new fabric.Group([
            this.rect,
            this.text], {
                originX: 'center',
                originY: 'center',
            });

        setControls(this.group);
        access.forceSet(this.group, 'node', this.id);

    }

    getId(): NodeId {
        return this.id;
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
