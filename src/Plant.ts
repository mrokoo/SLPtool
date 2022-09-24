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
    volume?: number;
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
    
    LogisticsGrade() {
        const table = this.fromToTable()
        let ctable: ITable[] = []
        for (let i = 0; i < table.length; i++) {
            for (let j = i + 1; j < table.length; j++) {
                ctable.push({
                    from: i,
                    to: j,
                    volume: table[i][j] += table[j][i],
                    grade: Grade.U
                })
            }
        }
        ctable = _.orderBy(ctable, ['volume', 'from', 'to'], ['desc', 'desc', 'desc'])

        // 分层算法，还要改。
        const ratio = [0.1, 0.2, 0.3, 0.4].map((v) => v * this.facAmount)
        for (let i = 0; i < this.facAmount * (this.facAmount) / 2; i++) {
            if (i + 1 <= ratio[0]) {
                ctable[i].grade = Grade.A
            } else if (i + 1 <= ratio[1]) {
                ctable[i].grade = Grade.E
            } else if (i + 1 <= ratio[2]) {
                ctable[i].grade = Grade.I
            } else if (i + 1 <= ratio[3]) {
                ctable[i].grade = Grade.O
            } else {
                continue
            }
        }
        return ctable
    }
    NonLogisticsGrade(): ITable[] {
        // 手动生成
        return [
            {
                from: 0,
                to: 1,
                grade: Grade.E
            },
            {
                from: 0,
                to: 2,
                grade: Grade.O
            },
            {
                from: 1,
                to: 2,
                grade: Grade.U
            }
        ]
    }


    get importance(): number[] {
        return this._importance
    }
    set importance(v: number[]) {
        this._importance = v
    }

    generalGrade(): ITable[] {
        const log = this.LogisticsGrade()
        const nlog = this.NonLogisticsGrade()
        return log.map((v => {
            for (const e of nlog) {
                if (v.from == e.from && v.to == e.to) {
                    v.volume = v.grade * this.importance[0] + e.grade * this.importance[1]
                }
                continue
            }

            return v
        }))

    }
}


