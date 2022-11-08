import './style.css'

import Plant from './Plant'
import { Process, Pair, Component } from './Pair'
import Facility from './Facility'
import _ from "lodash"



const plant1 = new Plant()
const facility1 = new Facility(30, 20)
const facility2 = new Facility(30, 20)
const facility3 = new Facility(30, 40)
plant1.registerFacilities([facility1, facility2, facility3])
// console.log(plant1.facAmount)
const process1 = new Process("铸造", facility1, 0.8)
const process2 = new Process("机加工", facility2, 0.8)
const process3 = new Process("精密加工", facility3, 0.8)
const componet1 = new Pair("机座", 1, 90000, [process1, process2, process3])
const process4 = new Process("铸造", facility1, 0.9)
const process5 = new Process("机加工", facility2, 0.5)
const process6 = new Process("精密加工", facility3, 0.7)
const componet2 = new Pair("机盖", 2, 80000, [process4, process5, process6])

const process7 = new Process("运输", facility3, 1)
const process8 = new Process("检查", facility1, 1)
const componet3 = new Component("轴", 4000, [process7, process8], [componet1, componet2])

plant1.registerPairs([componet1, componet2, componet3])

// console.log(plant1.fromToTable())


// import LogicFlow from '@logicflow/core'
// import "@logicflow/core/dist/style/index.css";
// import EndPoint from './EndPoint'
// import LinkEdgeModel from './LinkEdgeModel'

// const lf = new LogicFlow({
//     container: document.querySelector("#graph")!,
//     grid: true
// });

// lf.register(EndPoint);
// lf.register(LinkEdgeModel)
// // 只允许采用直线连接。意味着如果出现回流，依旧使用直线。

// function generateGraphData(e: Pair) {

//     return {
//         nodes: e.routes.map((value, index) => {
//             return {
//                 id: value.facility.id,
//                 type: value.facility.type,
//                 x: 100,
//                 y: 100 + index * 200,
//                 text: value.facility.id.toString()
//             }
//         }),

//         edges: e.routes.map((value, index, arr) => {
//             return {
//                 sourceNodeId: value.facility.id.toString(),
//                 targetNodeId: arr[index + 1]?.facility.id.toString() || "9999",
//                 type: "LinkEdge",
//                 text: "3434"
//             }
//         })
//     }


// }
// const data = generateGraphData(componet1)
// data.nodes.push({
//     id: 9999,
//     type: FacilityType.EndPoint,
//     x: 100,
//     y: 100 + componet1.routes.length * 200,
//     text: ""
// })
// console.log(data)
// lf.render(data);

console.log(plant1.LogisticsGrade())
console.log(plant1.facAmount)

class RenderGraph {
    public baseLength = 40
    public startPoint = [20, 20]
    public famount: number
    private el: HTMLCanvasElement
    constructor(el: HTMLCanvasElement | string, famount: number) {
        this.famount = famount
        if (typeof el == "string") {
            this.el = document.querySelector(el)! as HTMLCanvasElement
        } else {
            this.el = el
        }
    }

    drawRelatedTables(): void {
        // 画布大小根据创建元素调整。
        const base = this.baseLength
        const [startX, startY] = this.startPoint
        const cxt = this.el.getContext('2d')!
        // 绘制表头
        cxt.moveTo(startX, startY)
        cxt.lineTo(startX + 2.5 * base, startY)
        cxt.lineTo(startX + 2.5 * base, startY + 1 * base)

        const drawTop = (i: number) => {
            cxt.moveTo(startX, startY + 1 * base + i * base)
            cxt.lineTo(startX + 2.5 * base, startY + 1 * base + i * base)
            cxt.lineTo(startX + 2.5 * base + base * (this.famount - i) * Math.cos(Math.PI / 6), (startY + 1 * base) + (i * base) + base * (this.famount - i) * Math.sin(Math.PI / 6))
        }
        const drawBottom = (i: number) => {
            cxt.moveTo(startX, startY + 1 * base + i * base + base)
            cxt.moveTo(startX + 2.5 * base, startY + 1 * base + i * base + base)
            cxt.lineTo(startX + 2.5 * base + base * (i + 1) * Math.cos(Math.PI / 6), (startY + 1 * base) + (i * base) + base * (i + 1) * Math.sin(-Math.PI / 6) + base)
        }
        for (let i = 0; i < this.famount + 1; i++) {
            drawTop(i)
            if (i !== this.famount)
                drawBottom(i)
        }

        cxt.stroke()

    }

    getCoordinate(): {x: number, y: number}[] {
        // 返回文本中心坐标
        const base = this.baseLength
        const [startX, startY] = this.startPoint
        const coordinate = []
        for (let i = 0; i < this.famount - 1; i++) {
            let x = startX + 2.5 * base + Math.cos(Math.PI / 6) * base;
            let y = startY + 1 + (i + 1) * base

            for (let j = i; j < this.famount - 1; j++) {
                x += Math.cos(Math.PI / 6) * base
                y += Math.sin(Math.PI / 6) * base
                coordinate.push({ x, y })
            }

        }

        return coordinate
    }
}

const r = new RenderGraph('canvas', 3)

r.drawRelatedTables()

console.log(r.getCoordinate())


