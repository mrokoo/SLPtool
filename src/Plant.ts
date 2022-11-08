import Facility from "./Facility"
import { IPair } from "./Pair"
import _ from "lodash";
// 单位系统：用于更好的配置单位。
// type logisticsVolume = number[]


enum Grade {
    A = 4,
    E = 3,
    I = 2,
    O = 1,
    U = 0
}


interface ITable {
    from: number;
    to: number;
    score: number | string;
    grade: Grade;
}


export default class Plant {
    private facilities: Facility[] = []
    private pairs: IPair[] = []
    private _importance: number[] = [1, 1]

    constructor(public width = 300, public height = 200) {

    }

    registerFacility(f: Facility) {
        this.facilities.push(f)
    }

    registerFacilities(f: Facility[]) {
        this.facilities.push(...f)
    }

    get facAmount(): number {
        return this.facilities.length
    }

    registerPair(p: IPair) {
        this.pairs.push(p)
    }

    registerPairs(p: IPair[]) {
        this.pairs.push(...p)
    }

    fromToTable() {
        const table = new Array(this.facAmount) // 初始化table
        for (let i = 0; i < table.length; i++) {
            const ltable = new Array(this.facAmount)
            for (let j = 0; j < ltable.length; j++) {
                ltable[j] = 0
            }
            table[i] = ltable
        }

        this.pairs.forEach((value) => {
            const remainder = value.totalRemainderWeight
            let index = 0
            value.routes.forEach((v, i, routes) => {
                if (i < 1) return // 从第二个元素开始遍历
                const stid = v.facility.id - 1
                const aid = routes[i - 1].facility.id - 1
                table[aid][stid] += remainder[index++]
            });
        })

        return table
    }

    LogisticsGrade(): ITable[] {
        const table = this.fromToTable()
        let ctable: ITable[] = []
        for (let i = 0; i < table.length; i++) {
            for (let j = i + 1; j < table.length; j++) {
                ctable.push({
                    from: i,
                    to: j,
                    score: table[i][j] += table[j][i],
                    grade: Grade.U // 默认为U级
                })
            }
        }
        return ctable
    }
    NonLogisticsGrade(): ITable[] {
        const table = this.fromToTable()
        let ctable: ITable[] = []
        for (let i = 0; i < table.length; i++) {
            for (let j = i + 1; j < table.length; j++) {
                ctable.push({
                    from: i,
                    to: j,
                    score: 0,
                    grade: Grade.U // 默认为U级
                })
            }
        }
        return ctable
    }


    get importance(): number[] {
        return this._importance
    }
    set importance(v: number[]) {
        this._importance = v
    }

    generalGrade(log: ITable[], nlog: ITable[]): ITable[] {
        // 同样返回一个ITable数组，然后手动为其分级。
        return log.map( (v, i) => {
            return {
                ...v,
                score: log[i].grade * this.importance[0] + nlog[i].grade * this.importance[1],
                grade: Grade.U  
            }
        })

    }
}





