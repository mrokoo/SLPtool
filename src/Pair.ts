import Facility from "./Facility"


// 零件种类分为三类： 自制件、外购件、组装件。
// 三种零件的绘制方式不同、包含的内容也不相同。
// 需要仔细分别，慢慢勾画。
export interface IPair{
    routes: ProcessRoute;
    name: string;
    production: number;
    weight: number;
    totalWeight: number;
    grossWeight: number;
    totalGrossWeight: Number;
    scrapWeight: number[];
    totalScrapWeight: number[];
    remainderWeight: number[];
    totalRemainderWeight: number[];
}


class BasePair implements IPair {
    public routes!: ProcessRoute;
    private _weight!: number;
    public get weight(): number {
        return this._weight;
    }
    protected set weight(value: number) {
        this._weight = value;
    }
    public name!: string;
    public production!: number;

    constructor() {

    }

    get totalWeight(): number {
        return this.weight * this.production
    }
    get grossWeight(): number {
        let t = this.weight
        for (const process of this.routes) {
            t /= process.ratio
        }
        return t
    }
    get totalGrossWeight(): number {
        return this.grossWeight * this.production
    }

    get scrapWeight(): number[] {
        let thisCurrent = this.grossWeight
        return this.routes.map((value: Process) => {
            const e = thisCurrent * (1 - value.ratio)
            thisCurrent *= value.ratio
            return e
        })
    }
    get totalScrapWeight(): number[] {
        return this.scrapWeight.map(v => v * this.production)
    }

    get remainderWeight(): number[] {
        let thisCurrent = this.grossWeight
        return this.routes.map((value: Process) => {
            const e = thisCurrent * value.ratio
            thisCurrent *= value.ratio
            return e
        })
    }
    get totalRemainderWeight(): number[] {
        return this.remainderWeight.map(v => v * this.production)
    }
}


export class Pair extends BasePair {
    constructor(name: string, weight: number, production: number, routes: ProcessRoute) {
        super()
        this.name = name
        this.weight = weight
        this.routes = routes
        this.production = production
    }
}



export class Component extends BasePair {
    public subComponent: IPair[]
    constructor(name: string, production: number, routes: ProcessRoute, subComponent: IPair[] ) {
        super()
        this.name = name
        this.subComponent = subComponent
        this.routes = routes
        this.production = production
    }
    get weight() {
        let t = 0
        this.subComponent.forEach(v => t += v.weight)
        return t
    }
}

export class Process {
    public facility: Facility
    public name: string
    public ratio: number // 过程转化率
    public description: string
    constructor(name: string, facility: Facility, ratio: number, description: string = "") {
        this.facility = facility
        this.name = name
        this.ratio = ratio
        this.description = description
    }
}


type ProcessRoute = Process[] // 单个零件的工艺路线
