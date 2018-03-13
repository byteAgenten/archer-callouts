import {Callout} from "./callout";

import {BodySection} from "./body-section";
import {Direction, relBounds, relPos, Point, Rect} from "./utils";
export abstract class BodyView {

    protected _bodyEl: HTMLElement;

    protected _relativePosition: Point = new Point(50, -50);

    protected _sections: Array<BodySection> = [];

    private _mouseDownDestroyFn: any;
    private _mouseUpDestroyFn: any;
    private _mouseMoveDestroyFn: any;
    private _dragging: boolean = false;
    private _elDragStartPos: Point;

    private _dragStartPos: Point;

    protected _currentQuadrant: Direction;

    constructor(protected _callout: Callout) {
        this._bodyEl = document.createElement('div');
        this._bodyEl.setAttribute('class', 'ac-callout-body');

    }

    public get bounds(): ClientRect {

        return relBounds(this._callout.container, this._bodyEl);
    }

    public abstract get weldingPoint(): Point;

    public get relativePosition(): Point {
        return this._relativePosition;
    }

    public get sections(): Array<BodySection> {
        return this._sections;
    }

    public show(): void {

        this._callout.container.appendChild(this._bodyEl);
        this._bodyEl.addEventListener('mousedown', this.onMouseDown);
    }

    public calcAnchorDistance(rect: Rect): number {

        let anchorCenter = this._callout.connector.anchor.view.center;

        switch (this._currentQuadrant) {
            case Direction.North: {
                return anchorCenter.y - rect.y2;
            }
            case Direction.East: {
                return rect.x1 - anchorCenter.x;
            }
            case Direction.South: {
                return rect.y1 - anchorCenter.y;
            }
            case Direction.West: {
                return anchorCenter.x - rect.x2;
            }
            case Direction.NorthEast: {

                let a = rect.x1 - anchorCenter.x;
                let b = anchorCenter.y - rect.y2;
                return Math.sqrt(a * a + b * b);
            }
            case Direction.SouthEast: {

                let a = rect.x1 - anchorCenter.x;
                let b = rect.y1 - anchorCenter.y;
                return Math.sqrt(a * a + b * b);
            }
            case Direction.SouthWest: {

                let a = anchorCenter.x - rect.x2;
                let b = rect.y1 - anchorCenter.y;
                return Math.sqrt(a * a + b * b);
            }
            case Direction.NorthWest: {

                let a = anchorCenter.x - rect.x2;
                let b = anchorCenter.y - rect.y2;
                return Math.sqrt(a * a + b * b);
            }
        }

        return 0;
    }

    onMouseDown = (evt) => {

        console.log('mousedown');

        let anchorCenter = this._callout.connector.anchor.view.center;
        let containerBounds = this._callout.container.getBoundingClientRect();

        document.body.style.webkitUserSelect = 'none';

        this._dragStartPos = new Point(evt.clientX - containerBounds.left, evt.clientY - containerBounds.top);
        this._elDragStartPos = relPos(this._callout.container, this._bodyEl); // new Point(this._bodyEl.getBoundingClientRect().left, this._bodyEl.getBoundingClientRect().top);

        let onMouseMove = (evt: MouseEvent) => {

            let dragDelta = new Point(evt.clientX, evt.clientY)
                .sub(new Point(containerBounds.left, containerBounds.top))
                .sub(this._dragStartPos);

            let viewRect = Rect.fromBounds(this.bounds);

            let newPos = this._elDragStartPos.add(dragDelta);
            viewRect = viewRect.moveTo(newPos);

            this.protectShelter(anchorCenter, viewRect);

            this._bodyEl.style.left = viewRect.x1 + 'px';
            this._bodyEl.style.top = viewRect.y1 + 'px';

            setTimeout(() => {

                this._relativePosition.x = this.bounds.left - anchorCenter.x;
                this._relativePosition.y = this.bounds.top - anchorCenter.y;

                //console.log(this._relativePosition);
            });

            this._callout.updatePosition(true);
        };
        let onMouseUp = (evt: MouseEvent) => {

            document.body.removeEventListener('mousemove', onMouseMove);
            document.body.removeEventListener('mousup', onMouseUp);


            document.body.style.webkitUserSelect = null;
        };

        document.body.addEventListener('mousemove', onMouseMove);
        document.body.addEventListener('mouseup', onMouseUp);
    };

    private calcShelterOffset(p:Point, rect:Rect):Point {

        let delta = new Point(Math.abs(rect.x1 - p.x), Math.abs(rect.y2 - p.y));
        let distance = Math.sqrt(delta.x * delta.x + delta.y * delta.y);
        let ratio = distance / this._callout.connector.anchor.shelterRadius;
        let offset = delta.multiply(1 / ratio);
        return offset;
    }

    private calcAngle(p: Point, rect: Rect, direction: Direction): number {

        switch (this._currentQuadrant) {
            case Direction.NorthEast: {

                let a = rect.x1 - p.x;
                let b = p.y - rect.y2;
                let c = Math.sqrt(a * a + b * b);

                let angle = Math.asin(b / c);
                return angle;

            }
        }
        return 0;
    }

    public updatePosition(): void {

        let anchorCenter = this._callout.connector.anchor.view.center;

        let viewPos = anchorCenter.add(this._relativePosition);

        let currentRect = Rect.fromBounds(this.bounds);
        let targetRect = currentRect.moveTo(viewPos);


        let containerBounds = this._callout.container.getBoundingClientRect();
        if(!(0 <= targetRect.x1 && targetRect.x2 < containerBounds.width)) {
            targetRect.x1 = currentRect.x1;
        }
        if(!(0 <= targetRect.y1 && targetRect.y2 < containerBounds.height)) {
            targetRect.y1 = currentRect.y1;
        }
        this.protectShelter(anchorCenter, targetRect);
        this._bodyEl.style.left = targetRect.x1 + 'px';
        this._bodyEl.style.top = targetRect.y1 + 'px';


    }

    private checkBorderCollision(rect: Rect): boolean {

        let containerBounds = this._callout.container.getBoundingClientRect();

        return !(0 <= rect.x1 && rect.x2 < containerBounds.width && 0 <= rect.y1 && rect.y2 < containerBounds.height); // bounds.left < 0 || bounds.top < 0 || bounds.left + bounds.width > document.body.clientWidth || bounds.top + bounds.height > document.body.clientHeight; // bounds.right > document.body.clientWidth; // || bounds.top < 0 || bounds.y2 > document.body.clientHeight;
    }


    public hide(): void {
        this._bodyEl.removeEventListener('mousedown', this.onMouseDown);
        this._bodyEl.remove();
    }

    abstract calcQuadrant(rect: Rect): Direction;


    private protectShelter(anchorCenter:Point, viewRect: Rect) {

        this._currentQuadrant = this.calcQuadrant(viewRect);
        let distance = this.calcAnchorDistance(viewRect);

        if (distance <= this._callout.connector.anchor.shelterRadius) {

            switch (this._currentQuadrant) {
                case Direction.North: {
                    viewRect.y2 = anchorCenter.y - this._callout.connector.anchor.shelterRadius;
                    break;
                }
                case Direction.South: {
                    viewRect.y1 = anchorCenter.y + this._callout.connector.anchor.shelterRadius;
                    break;
                }
                case Direction.East: {
                    viewRect.x1 = anchorCenter.x + this._callout.connector.anchor.shelterRadius;
                    break;
                }
                case Direction.West: {
                    viewRect.x2 = anchorCenter.x - this._callout.connector.anchor.shelterRadius;
                    break;
                }
                case Direction.NorthEast: {

                    let offset = this.calcShelterOffset(anchorCenter, viewRect);
                    viewRect.y1 = viewRect.y1 - offset.y;
                    viewRect.x1 = viewRect.x1 + offset.x;
                    break;
                }

                case Direction.SouthEast: {

                    let offset = this.calcShelterOffset(anchorCenter, viewRect);
                    viewRect.y1 = viewRect.y1 + offset.y;
                    viewRect.x1 = viewRect.x1 + offset.x;
                    break;
                }
                case Direction.SouthWest: {

                    let offset = this.calcShelterOffset(anchorCenter, viewRect);
                    viewRect.y1 = viewRect.y1 + offset.y;
                    viewRect.x1 = viewRect.x1 - offset.x;
                    break;
                }
                case Direction.NorthWest: {

                    let offset = this.calcShelterOffset(anchorCenter, viewRect);
                    viewRect.y1 = viewRect.y1 - offset.y;
                    viewRect.x1 = viewRect.x1 - offset.x;
                    break;
                }
            }
        }
    }
}

export class DefaultBodyView extends BodyView {

    constructor(callout: Callout) {

        super(callout);
        this._bodyEl.setAttribute('class', this._bodyEl.getAttribute('class') + ' default');

        let headerSection = new BodySection('header');
        let contentSection = new BodySection('body');

        this._bodyEl.appendChild(headerSection.el);
        this._bodyEl.appendChild(contentSection.el);

        this._sections.push(headerSection);
        this._sections.push(contentSection);
    }

    public get weldingPoint(): Point {

        let anchorCenter = this._callout.connector.anchor.view.center;

        let bodyBounds = this.bounds;

        let weldingPoint = new Point(0, 0);

        weldingPoint.x = bodyBounds.left;

        if (bodyBounds.top <= anchorCenter.y && anchorCenter.y < bodyBounds.top + bodyBounds.height) {
            weldingPoint.y = anchorCenter.y;
        } else {

            if (anchorCenter.y <= bodyBounds.top + bodyBounds.height) {
                weldingPoint.y = bodyBounds.top;
            } else {
                weldingPoint.y = bodyBounds.top + bodyBounds.height;
            }
        }

        if (bodyBounds.left <= anchorCenter.x && anchorCenter.x < bodyBounds.left + bodyBounds.width) {
            weldingPoint.x = anchorCenter.x;
        } else {

            if (anchorCenter.x <= bodyBounds.left) {
                weldingPoint.x = bodyBounds.left;
            } else {
                weldingPoint.x = bodyBounds.left + bodyBounds.width;
            }
        }
        return weldingPoint;
    }

    public get centerPoint(): Point {

        let b = this.bounds;
        return new Point(
            b.left + b.width / 2,
            b.top + b.height / 2
        );
    }


    public calcQuadrant(rect: Rect = null): Direction {

        let anchorCenter = this._callout.connector.anchor.view.center;
        let bodyBounds = rect != null ? rect : Rect.fromBounds(this.bounds);

        let direction: Direction;

        if (bodyBounds.x1 <= anchorCenter.x && anchorCenter.x < bodyBounds.x2) {

            direction = bodyBounds.y1 + bodyBounds.height < anchorCenter.y ? Direction.North : Direction.South;

        } else if (bodyBounds.y1 <= anchorCenter.y && anchorCenter.y < bodyBounds.y2) {

            direction = anchorCenter.x < bodyBounds.x1 ? Direction.East : Direction.West;

        } else if (anchorCenter.x < bodyBounds.x1 && anchorCenter.y > bodyBounds.y2) {

            direction = Direction.NorthEast;

        } else if (anchorCenter.x < bodyBounds.x1 && anchorCenter.y < bodyBounds.y1) {

            direction = Direction.SouthEast;

        } else if (anchorCenter.x > bodyBounds.x2 && anchorCenter.y < bodyBounds.y1) {

            direction = Direction.SouthWest;

        } else {

            direction = Direction.NorthWest;
        }

        return direction;
    }
}