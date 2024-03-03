import { fabric } from 'fabric';
import { ReferenceId } from '../common/id';
import * as access from '../common/util/access';

/**
 * Graph edge is a visual representation of reference between two symbols.
 */
export default class Edge {
    private id: ReferenceId;
    private line: fabric.Line;

    /**
     * Create new Edge instance
     * @param id unique ID of the edge
     * @param from source node
     * @param to destination node
     */
    constructor(
        id: ReferenceId
    ) {
        this.id = id;
        const coords = [0, 0, 0, 0];
        this.line = new fabric.Line(
            coords, {
            stroke: 'red',
            strokeWidth: 3,
            selectable: false,
            evented: false
        });
        access.forceSet(this.line, 'edge', this.id);
    }

    getId(): ReferenceId {
        return this.id;
    }

    getObject(): fabric.Line {
        return this.line;
    }

    setFromPosition(pos: fabric.Point) {
        this.line.set({ x1: pos.x, y1: pos.y });
    }

    setToPosition(pos: fabric.Point) {
        this.line.set({ x2: pos.x, y2: pos.y });
    }
}
