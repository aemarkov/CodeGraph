import { fabric } from 'fabric';

/**
 * Graph edge is a visual representation of reference between two symbols.
 */
export default class Edge {
    private id: string;
    private line: fabric.Line;

    /**
     * Create new Edge instance
     * @param id unique ID of the edge
     * @param from source node
     * @param to destination node
     */
    constructor(
        id: string,
        from: fabric.Point,
        to: fabric.Point
    ) {
        this.id = id;
        const coords = [from.x, from.y, to.x, to.y];
        this.line = new fabric.Line(
            coords, {
            stroke: 'red',
            strokeWidth: 3,
            selectable: false,
            evented: false
        });
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
