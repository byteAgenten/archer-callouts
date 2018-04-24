import {Callout} from "./callout";
import {addClass, removeClass, Direction, Rect, Point} from "./utils";

export abstract class WeldingSeamView {

    protected _el: HTMLElement;

    protected _layoutData: WeldLayoutData = new WeldLayoutData();

    constructor(protected _callout: Callout) {

        this._el = document.createElement('div');
        this._el.setAttribute('class', 'ac-welding-seam');
        if (this._callout.config.customClass != null) addClass(this._el, this._callout.config.customClass);
    }

    public addToStage(): void {

        this._callout.container.appendChild(this._el);
        this.hide();
        this._el.style.transform = 'scale(1)';
    }

    public removeFromStage(): void {

        this._el.remove();
    }

    public show(): void {
        this._el.style.visibility = 'visible';
    }

    public hide(): void {
        this._el.style.visibility = 'hidden';
    }

    get layoutData(): WeldLayoutData {
        return this._layoutData;
    }

    public abstract fadeIn(): Promise<void>;

    public abstract fadeOut(): Promise<void>;


    public abstract get weldSide(): Direction;

    public abstract calculateLayout(bodyRect?: Rect): void;

    public abstract updateLayout(): void;
}


export class DefaultWeldingSeamView extends WeldingSeamView {

    private _scale: number = 1;

    private _transformOrigin: Direction;

    protected _angle: number;

    private _lastWeldSide: Direction;

    constructor(protected _callout: Callout) {
        super(_callout);
        addClass(this._el, 'default');
    }


    get weldSide(): Direction {
        return this._layoutData.weldSide;
    }

    private detectSeamSide(layoutData: WeldLayoutData): void {

        let anchorCenter = this._callout.connector.anchor.view.layoutData.rect.center;
        let bodyRect = this._callout.body.view.layoutData.rect;

        //bodyFullSize is needed in case of fadeOut sequence! bodyRect.width will be 0 at the end of the fadeOut sequence.
        //This would lead to wrong calculation results here. Therefore we have to know what was the dimension
        //of the document before fadeOut sequence started.
        let bodyFullSize = this._callout.body.view.layoutData.fullSize;
        //console.log('^^^^^^^^^');
        //console.log(bodyFullSize);

        let weldPoint = this._callout.body.view.layoutData.closestPoint;

        let a = weldPoint.x - anchorCenter.x;
        let b = weldPoint.y - anchorCenter.y;

        layoutData.angle = Math.asin(b / Math.sqrt(a * a + b * b));

        if (anchorCenter.x < bodyRect.x2 - bodyRect.width / 2) {

            if (layoutData.angle < -1 * Math.PI / 4) {

                layoutData.transformOrigin = Direction.SouthWest;
                layoutData.weldSide = Direction.South;
                if (bodyRect.x1 > anchorCenter.x) {
                    layoutData.weldPoint = new Point(bodyRect.x1, bodyRect.y2);
                } else {
                    layoutData.weldPoint = new Point(anchorCenter.x, bodyRect.y2);
                }

                layoutData.rect = new Rect(
                    bodyRect.x1,
                    bodyRect.y2 - this._callout.connector.view.lineWidth,
                    bodyFullSize.width,
                    this._callout.connector.view.lineWidth
                );

            } else if (layoutData.angle > Math.PI / 4) {

                layoutData.transformOrigin = Direction.NorthWest;
                layoutData.weldSide = Direction.North;
                if (bodyRect.x1 > anchorCenter.x) {
                    layoutData.weldPoint = new Point(bodyRect.x1, bodyRect.y1);
                } else {
                    layoutData.weldPoint = new Point(anchorCenter.x, bodyRect.y1);
                }

                layoutData.rect = new Rect(
                    bodyRect.x1,
                    bodyRect.y1,
                    bodyFullSize.width,
                    this._callout.connector.view.lineWidth
                );

            } else {

                if (anchorCenter.y > bodyRect.y2) {
                    layoutData.transformOrigin = Direction.SouthWest;
                    layoutData.weldPoint = new Point(bodyRect.x1, bodyRect.y2);
                } else if (anchorCenter.y < bodyRect.y1) {
                    layoutData.transformOrigin = Direction.NorthWest;
                    layoutData.weldPoint = new Point(bodyRect.x1, bodyRect.y1);
                } else {
                    layoutData.transformOrigin = Direction.West;
                    layoutData.weldPoint = new Point(bodyRect.x1, anchorCenter.y);
                }
                layoutData.weldSide = Direction.West;
                layoutData.rect = new Rect(
                    bodyRect.x1,
                    bodyRect.y1,
                    this._callout.connector.view.lineWidth,
                    bodyFullSize.height
                );
            }

        } else {

            if (layoutData.angle < -1 * Math.PI / 4) {

                layoutData.transformOrigin = Direction.SouthEast;
                layoutData.weldSide = Direction.South;

                if (bodyRect.x2 < anchorCenter.x) {
                    layoutData.weldPoint = new Point(bodyRect.x2, bodyRect.y2);
                } else {
                    layoutData.weldPoint = new Point(anchorCenter.x, bodyRect.y2);
                }
                layoutData.rect = new Rect(
                    bodyRect.x1,
                    bodyRect.y2 - this._callout.connector.view.lineWidth,
                    bodyFullSize.width,
                    this._callout.connector.view.lineWidth
                );

            } else if (layoutData.angle > Math.PI / 4) {

                layoutData.transformOrigin = Direction.NorthEast;
                layoutData.weldSide = Direction.North;
                if (bodyRect.x2 < anchorCenter.x) {
                    layoutData.weldPoint = new Point(bodyRect.x2, bodyRect.y1);
                } else {
                    layoutData.weldPoint = new Point(anchorCenter.x, bodyRect.y1);
                }
                layoutData.rect = new Rect(
                    bodyRect.x1,
                    bodyRect.y1,
                    bodyFullSize.width,
                    this._callout.connector.view.lineWidth
                );

            } else {

                if (anchorCenter.y > bodyRect.y2) {
                    layoutData.transformOrigin = Direction.SouthEast;
                    layoutData.weldPoint = new Point(bodyRect.x2, bodyRect.y2);
                } else if (anchorCenter.y < bodyRect.y1) {
                    layoutData.transformOrigin = Direction.NorthEast;
                    layoutData.weldPoint = new Point(bodyRect.x2, bodyRect.y1);
                } else {
                    layoutData.transformOrigin = Direction.East;
                    layoutData.weldPoint = new Point(bodyRect.x2, anchorCenter.y);
                }
                layoutData.weldSide = Direction.East;
                layoutData.rect = new Rect(
                    bodyRect.x2 - this._callout.connector.view.lineWidth,
                    bodyRect.y1,
                    this._callout.connector.view.lineWidth,
                    bodyFullSize.height
                );
            }
        }
    }

    public calculateLayout(): void {

        if (true) {

            let layoutData = new WeldLayoutData();
            this.detectSeamSide(layoutData);
            this._layoutData = layoutData;

        } else {

        }

    }

    public updateLayout(): void {

        this._el.style.left = this._layoutData.rect.x1 + 'px';
        this._el.style.top = this._layoutData.rect.y1 + 'px';
        this._el.style.width = this._layoutData.rect.width + 'px';
        this._el.style.height = this._layoutData.rect.height + 'px';

        if (this._layoutData.weldSide != this._lastWeldSide) {

            if (this._lastWeldSide != null) removeClass(this._el, Direction[this._lastWeldSide].toLowerCase());
            addClass(this._el, Direction[this._layoutData.weldSide].toLowerCase());
            this._lastWeldSide = this._layoutData.weldSide;
        }
    }

    animate(fadeIn: boolean): Promise<void> {

        return new Promise<void>((resolve, reject) => {

            console.log(this._layoutData.rect);

            let startTime = Date.now();
            let endTime = startTime + 400;

            let xOrigin: string = null;
            let yOrigin: string = null;

            if (this._layoutData.weldSide == Direction.West) {

                yOrigin = this.layoutData.transformOrigin == Direction.NorthWest ? 'top' : (this.layoutData.transformOrigin == Direction.SouthWest ? 'bottom' : 'center');

            } else if (this.layoutData.weldSide == Direction.North) {

                xOrigin = this.layoutData.transformOrigin == Direction.NorthWest ? 'left' : (this.layoutData.transformOrigin == Direction.NorthEast ? 'right' : 'center');

            } else if (this.layoutData.weldSide == Direction.East) {

                yOrigin = this.layoutData.transformOrigin == Direction.SouthEast ? 'bottom' : (this.layoutData.transformOrigin == Direction.NorthEast ? 'top' : 'center');

            } else {

                xOrigin = this.layoutData.transformOrigin == Direction.SouthEast ? 'right' : (this.layoutData.transformOrigin == Direction.SouthWest ? 'left' : 'center');
            }


            if (xOrigin != null) {
                this._el.style.transformOrigin = xOrigin + " top";
            } else {
                let v = "left " + yOrigin;
                //console.log(v);
                this._el.style.transformOrigin = v;
            }


            //console.log(Direction[this._layoutData.weldSide]);

            let weldSide = this._layoutData.weldSide;
            //console.log(Direction[weldSide]);

            let firstRun = true;

            let loop = () => {

                //console.log(Direction[weldSide]);

                let now = Date.now();

                if (firstRun) {
                    this.show();
                    firstRun = false;
                }

                if (now < endTime) {

                    let ratio = (now - startTime) / (endTime - startTime);
                    this._scale = fadeIn ? ratio : 1 - ratio;

                    requestAnimationFrame(loop);

                } else {

                    this._scale = fadeIn ? 1 : 0;
                    this._el.style.transform = null;
                    resolve();
                }

                this._el.style.transform = ((weldSide == Direction.East || weldSide == Direction.West) ? 'scaleY(' : 'scaleX(') + this._scale + ')';

                //console.log(this._el.style.transform);
            };
            requestAnimationFrame(loop);
        });
    }

    private animationRunning: boolean = false;

    public fadeIn(): Promise<void> {

        this.animationRunning = true;
        return this.animate(true);
    }

    public fadeOut(): Promise<void> {
        return this.animate(false).then(() => {
            this.removeFromStage();
            this.animationRunning = false;
        });
    }


}

export class WeldLayoutData {

    constructor(public angle: number = 0,
                public rect: Rect = null,
                public weldSide: Direction = null,
                public weldPoint: Point = null,
                public transformOrigin: Direction = null) {

        if (rect == null) this.rect = new Rect();
        if (weldPoint == null) this.weldPoint = new Point();
    }
}