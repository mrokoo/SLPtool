import { PolylineEdgeModel, PolylineEdge } from "@logicflow/core"


 class LinkEdgeModel extends PolylineEdgeModel {
  customTextPosition = true;
  getTextPosition() {
    const position = super.getTextPosition();
    position.x -= 25
    return position;
  }
}
class LinkEdge extends PolylineEdge {}
export default {
  type: "LinkEdge",
  view: LinkEdge,
  model: LinkEdgeModel
}