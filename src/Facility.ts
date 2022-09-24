export enum FacilityType {
    Operate = "circle",
    Storage = "triangle",
    EndPoint = "EndTextPoint",
    Check = "check"
}

export default class Facility {
    private static key: number = 1 // 自增id
    public id: number
    public width: number
    public height: number
    public type: FacilityType = FacilityType.Operate
    constructor(width: number, height: number) {
        this.id = Facility.key++
        this.width = width
        this.height = height
    }
}
