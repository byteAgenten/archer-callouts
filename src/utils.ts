export function addClass(element: HTMLElement, clazz: string) {

    let classContent = element.getAttribute('class');
    if( classContent == null) {
        element.setAttribute('class', '');
        classContent = '';
    }
    if (classContent.length > 0) classContent += ' ';
    classContent += clazz;

    element.setAttribute('class', classContent);
}

export function removeClass(element: HTMLElement, clazz: string) {

    let classContent = element.getAttribute('class');
    let classIndex = classContent.search('\\b' + clazz + '\\b');
    if (classIndex >= 0) {

        classContent = classContent.substring(0, classIndex) + ' ' + classContent.substring(classIndex + clazz.length, classContent.length);
        classContent = classContent.replace(/( ){2,}/g, ' '); //Remove potentially double blanks
        element.setAttribute('class', classContent);
    }
}

export function setClasses(element: HTMLElement, classes: Array<string>) {

    let classContent = '';
    classes.forEach((clazz) => {
        if (classContent.length > 0) classContent += ' ';
        classContent += clazz;
    });
    element.setAttribute('class', classContent);
}

export function relPos(container: HTMLElement, el: HTMLElement): Point {

    let containerBounds = container.getBoundingClientRect();
    let elBounds = el.getBoundingClientRect();

    return new Point(
        elBounds.left - containerBounds.left,
        elBounds.top - containerBounds.top
    );
}

export function relBounds(container: HTMLElement, el: HTMLElement): ClientRect {

    let elBounds = el.getBoundingClientRect();
    let containerBounds = container.getBoundingClientRect();

    return {
        left: elBounds.left - containerBounds.left,
        top: elBounds.top - containerBounds.top,
        right: containerBounds.right - elBounds.right,
        bottom: containerBounds.bottom - elBounds.bottom,
        width: elBounds.width,
        height: elBounds.height
    } as ClientRect;
}

export enum Direction {
    North,
    NorthEast,
    East,
    SouthEast,
    South,
    SouthWest,
    West,
    NorthWest
}

export class Point {

    constructor(public x: number = 0, public y: number = 0) {

    }

    public sub(p: Point): Point {

        return new Point(
            this.x - p.x,
            this.y - p.y
        );
    }

    public add(p: Point): Point {

        return new Point(
            this.x + p.x,
            this.y + p.y
        );
    }

    multiply(factor: number) {

        return new Point(
            this.x * factor,
            this.y * factor
        );
    }
}

export class Rect {

    private _x2: number;
    private _y2: number;

    constructor(private _x1: number = 0, private _y1: number = 0, private _width: number = 0, private _height: number = 0) {

        this._x2 = this._x1 + this._width;
        this._y2 = this._y1 + this._height;
    }


    get x1(): number {
        return this._x1;
    }

    set x1(v: number) {
        this._x1 = v;
        this._x2 = this._x1 + this._width;
    }

    get y1(): number {
        return this._y1;
    }

    set y1(v: number) {
        this._y1 = v;
        this._y2 = this._y1 + this._height;
    }

    get width(): number {
        return this._width;
    }

    set width(v: number) {
        this._width = v;
        this._x2 = this._x1 + this._width;
    }

    get height(): number {
        return this._height;
    }

    get x2(): number {
        return this._x2;
    }

    set x2(v: number) {
        this._x2 = v;
        this._x1 = this._x2 - this._width;
    }

    get y2(): number {
        return this._y2;
    }

    set y2(v: number) {

        this._y2 = v;
        this._y1 = this._y2 - this._height;
    }

    get center(): Point {

        return new Point(
            this.x1 + this.width / 2,
            this.y1 + this.height / 2
        );
    }

    public shift(p: Point): Rect {

        return new Rect(
            this._x1 + p.x,
            this._y1 + p.y,
            this._width,
            this._height
        );
    }

    static fromBounds(bounds: ClientRect) {

        return new Rect(
            bounds.left,
            bounds.top,
            bounds.width,
            bounds.height
        )
    }

    moveTo(p: Point): Rect {

        return new Rect(
            p.x,
            p.y,
            this._width,
            this._height
        );
    }
}
