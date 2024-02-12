/* Common utilities for drawing. */

import { fabric } from 'fabric';

/**
 * CSS font properties
 */
export interface Style {
    fontSize: number,
    fontFamily: string,
    fontColor: string
};


/**
 * Creates canvas
 */
export function createCanvas(): fabric.Canvas {
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

/**
 * Get default font style from CSS
 * This is used to use same style as default in VSCode
 */
export function getDefaultStyle(): Style {
    const style = getComputedStyle(document.body);
    return {
        fontSize: Number(style.getPropertyValue('font-size')),
        fontFamily: style.getPropertyValue('font-family'),
        fontColor: style.getPropertyValue('color')
    };
}

/**
 * Disable scaling and rotation of the FabricJS object
 */
export function setControls(object: fabric.Object) {
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
