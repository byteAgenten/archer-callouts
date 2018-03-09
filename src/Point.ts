export class Point {

    constructor(public x:number, public y:number) {

    }

    public sub(p: Point):Point {

        return new Point(
            this.x - p.x,
            this.y - p.y
        );
    }
}