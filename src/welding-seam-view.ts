import {Callout} from "./callout";
import {addClass, removeClass} from "./utils";
import {Point} from "./Point";
export abstract class WeldingSeamView {

    protected _el: HTMLElement;

    constructor(protected _callout: Callout) {

        this._el = document.createElement('div');
        this._el.setAttribute('class', 'ac-welding-seam');
    }

    public show(): void {

        document.body.appendChild(this._el);
    }

    public hide(): void {

        this._el.remove();
    }

    public abstract fadeIn(): Promise<void>;

    public abstract fadeOut(): Promise<void>;

    public abstract update(): void
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

export class DefaultWeldingSeamView extends WeldingSeamView {

    private _scale: number = 1;

    private _weldSide: Direction = Direction.West;

    private _transformOrigin: Direction;

    constructor(protected _callout: Callout) {
        super(_callout);
        addClass(this._el, 'default');
    }

    animate(fadeIn: boolean): Promise<void> {

        return new Promise<void>((resolve, reject) => {

            let startTime = Date.now();
            let endTime = startTime + 200;

            let xOrigin:string = null;
            let yOrigin:string = null;

            if( this._weldSide == Direction.West) {

                yOrigin = this._transformOrigin == Direction.NorthWest ? 'top' : (this._transformOrigin == Direction.SouthWest ? 'bottom' : 'center');

            } else if( this._weldSide == Direction.North) {

                xOrigin = this._transformOrigin == Direction.NorthWest ? 'left' : (this._transformOrigin == Direction.NorthEast ? 'right' : 'center');

            } else if( this._weldSide == Direction.East) {

                yOrigin = this._transformOrigin == Direction.SouthEast ? 'bottom' : (this._transformOrigin == Direction.NorthEast ? 'top' : 'center');

            } else {

                xOrigin = this._transformOrigin == Direction.SouthEast ? 'right' : (this._transformOrigin == Direction.SouthWest ? 'left' : 'center');
            }

            if( xOrigin != null) {
                this._el.style.transformOrigin = xOrigin + ' top';
            } else {
                this._el.style.transformOrigin = 'left ' + yOrigin;
            }

            if (this._weldSide == Direction.East || this._weldSide == Direction.West) {
                this._el.style.transform = fadeIn ? 'scaleY(0)' : 'scaleY(1)';
            } else {
                this._el.style.transform = fadeIn ? 'scaleX(0)' : 'scaleX(1)';
            }

            let loop = () => {

                let now = Date.now();

                if (now < endTime) {

                    let ratio = (now - startTime) / (endTime - startTime);
                    this._scale = fadeIn ? ratio : 1 - ratio;

                    requestAnimationFrame(loop);

                } else {

                    this._scale = fadeIn ? 1 : 0;
                    this._el.style.transform = null;
                    resolve();
                }
                this._el.style.transform = ((this._weldSide == Direction.East || this._weldSide == Direction.West) ? 'scaleY(' : 'scaleX(') + this._scale + ')';

            };
            requestAnimationFrame(loop);
        });
    }

    public fadeIn(): Promise<void> {

        this.show();
        return this.animate(true);
    }

    public fadeOut(): Promise<void> {
        return this.animate(false).then(() => {
            this.hide();
        });
    }


    public update(): void {

        let anchorBounds = this._callout.connector.anchor.view.bounds;
        let bodyBounds = this._callout.body.bounds;

        let weldingPoint = this._callout.body.view.weldingPoint;
        let anchorPoint = new Point(
            anchorBounds.left + anchorBounds.width / 2,
            anchorBounds.top + anchorBounds.height / 2
        );

        let a = weldingPoint.x - anchorPoint.x;
        let b = weldingPoint.y - anchorPoint.y;

        let rad = Math.asin((weldingPoint.y - anchorPoint.y) / Math.sqrt(a * a + b * b));

        let weldSide = null;
        this._el.style.right = null;
        this._el.style.bottom = null;
        this._el.style.top = null;
        this._el.style.left = null;
        this._el.style.width = null;
        this._el.style.height = null;

        if (anchorBounds.right < bodyBounds.left) {

            if (rad < -1 * Math.PI / 4) {

                this._transformOrigin = Direction.SouthWest;
                weldSide = Direction.South;

                this._el.style.top = (bodyBounds.bottom - this._callout.connector.view.lineWidth) + 'px';
                this._el.style.width = bodyBounds.width + 'px';
                this._el.style.left = bodyBounds.left + 'px';

            } else if (rad > Math.PI / 4) {

                this._transformOrigin = Direction.NorthWest;
                weldSide = Direction.North;

                this._el.style.top = bodyBounds.top + 'px';
                this._el.style.width = bodyBounds.width + 'px';
                this._el.style.left = bodyBounds.left + 'px';

            } else {

                let b = this._callout.body.view.bounds;
                let anchorCenter = this._callout.connector.anchor.view.center;

                this._transformOrigin = anchorCenter.y > b.bottom ? Direction.SouthWest : (anchorCenter.y < b.top ? Direction.NorthWest : Direction.West);
                weldSide = Direction.West;

                this._el.style.top = bodyBounds.top + 'px';
                this._el.style.height = bodyBounds.height + 'px';
                this._el.style.left = bodyBounds.left + 'px';
            }

        } else {

            if (rad < -1 * Math.PI / 4) {

                this._transformOrigin = Direction.SouthEast;
                weldSide = Direction.South;

                this._el.style.top = (bodyBounds.bottom - this._callout.connector.view.lineWidth) + 'px';
                this._el.style.width = bodyBounds.width + 'px';
                this._el.style.left = bodyBounds.left + 'px';

            } else if (rad > Math.PI / 4) {

                this._transformOrigin = Direction.NorthEast;
                weldSide = Direction.North;

                this._el.style.top = (bodyBounds.top) + 'px';
                this._el.style.width = bodyBounds.width + 'px';
                this._el.style.left = bodyBounds.left + 'px';

            } else {

                let b = this._callout.body.view.bounds;
                let anchorCenter = this._callout.connector.anchor.view.center;

                this._transformOrigin = anchorCenter.y > b.bottom ? Direction.SouthEast : (anchorCenter.y < b.top ? Direction.NorthEast : Direction.East);
                weldSide = Direction.East;

                this._el.style.top = (bodyBounds.top) + 'px';
                this._el.style.height = bodyBounds.height + 'px';
                this._el.style.left = (bodyBounds.left + bodyBounds.width - this._callout.connector.view.lineWidth) + 'px';
            }
        }

        if (this._weldSide != weldSide) {

            removeClass(this._el, Direction[this._weldSide].toLowerCase());


            addClass(this._el, Direction[weldSide].toLowerCase());

            this._weldSide = weldSide;
        }
    }
}