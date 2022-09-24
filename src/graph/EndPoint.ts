import { PointAnchor, TextNode, TextNodeModel } from '@logicflow/core'

class EndTextPoint extends TextNodeModel {
    initNodeData(data: any): void {
        super.initNodeData(data)
    }

    getDefaultAnchor(): PointAnchor[] {
        const { height, x, y, id } = this;

        return [
            {
                x,
                y: y - 0.5 * height,
                id: `${id}_0`
            }
        ]
    }
}


export default {
    type: "EndTextPoint",
    view: TextNode,
    model: EndTextPoint
};