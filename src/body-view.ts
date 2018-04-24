import {Callout} from "./callout";

import {BodySection} from "./body-section";
import {Direction, relBounds, relPos, Point, Rect, removeClass, addClass, Dimension} from "./utils";
export abstract class BodyView {

    protected _bodyContainerEl: HTMLElement;
    protected _bodyEl: HTMLElement;
    protected _sectionContainerEl: HTMLElement;

    protected _relativePosition: Point = new Point(50, -50);
    protected _dragStartRelativePosition: Point = new Point(0, 0);

    protected _sections: Array<BodySection> = [];

    protected _layoutData: BodyViewLayoutData = new BodyViewLayoutData();

    private _mouseDownDestroyFn: any;
    private _mouseUpDestroyFn: any;
    private _mouseMoveDestroyFn: any;
    private _dragging: boolean = false;
    private _elDragStartPos: Point;

    private _dragStartPos: Point;

    protected _currentQuadrant: Direction;

    constructor(protected _callout: Callout) {
        this._bodyContainerEl = document.createElement('div');
        addClass(this._bodyContainerEl, 'ac-callout-body-container');

        this._bodyEl = document.createElement('div');
        addClass(this._bodyEl, 'ac-callout-body');

        this._bodyContainerEl.appendChild(this._bodyEl);

        this._sectionContainerEl = document.createElement('div');
        this._sectionContainerEl.setAttribute('class', 'ac-callout-body-sections');
        this._bodyEl.appendChild(this._sectionContainerEl);

        if (this._callout.config.offsetX != null) this._relativePosition.x = this._callout.config.offsetX;
        if (this._callout.config.offsetY != null) this._relativePosition.y = this._callout.config.offsetY;
    }

    public get bounds(): ClientRect {

        return relBounds(this._callout.container, this._bodyEl);
    }

    public abstract calcWeldingPoint(bodyRect: Rect): Point;

    public get relativePosition(): Point {
        return this._relativePosition;
    }

    public get sections(): Array<BodySection> {
        return this._sections;
    }

    public addToStage(): void {

        this._callout.container.appendChild(this._bodyContainerEl);
        this.hide();
        this._bodyEl.style.transform = 'scale(1)';

        let rect = Rect.fromBounds(relBounds(this._callout.container, this._bodyContainerEl));

        this._layoutData.fullSize = rect.dimension;
        console.log('----');
        console.log(this._layoutData.fullSize);
        this._bodyEl.addEventListener('mousedown', this.onMouseDown);
    }

    public  removeFromStage(): void {

        this._bodyEl.removeEventListener('mousedown', this.onMouseDown);
        this._bodyContainerEl.remove();
    }

    public show(): void {
        this._bodyContainerEl.style.visibility = 'visible';
    }

    public hide(): void {
        this._bodyContainerEl.style.visibility = 'hidden';
    }

    protected calcClosestPoint(rect: Rect): Point {

        let quadrant = this.calcQuadrant(rect);
        let anchorCenter = this._callout.connector.anchor.view.layoutData.rect.center;

        switch (quadrant) {
            case Direction.North: {
                return new Point(anchorCenter.x, rect.y2);
            }
            case Direction.East: {
                return new Point(rect.x1, anchorCenter.y);
            }
            case Direction.South: {
                return new Point(anchorCenter.x, rect.y1);
            }
            case Direction.West: {
                return new Point(rect.x2, anchorCenter.y);
            }
            case Direction.NorthEast: {

                return new Point(rect.x1, rect.y2);
            }
            case Direction.SouthEast: {

                return new Point(rect.x1, rect.y1);
            }
            case Direction.SouthWest: {

                return new Point(rect.x2, rect.y1);
            }
            case Direction.NorthWest: {

                return new Point(rect.x2, rect.y2);
            }
        }
    }

    protected calcAnchorDistance(anchorCenter: Point, rect: Rect, quadrant: Direction): number {

        switch (quadrant) {
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

        evt.stopImmediatePropagation();
        evt.preventDefault();

        let containerBounds = this._callout.container.getBoundingClientRect();

        document.body.style.webkitUserSelect = 'none';

        this._dragStartPos = new Point(evt.clientX - containerBounds.left, evt.clientY - containerBounds.top);
        this._elDragStartPos = relPos(this._callout.container, this._bodyEl); // new Point(this._bodyEl.getBoundingClientRect().left, this._bodyEl.getBoundingClientRect().top);

        this._dragStartRelativePosition = this._relativePosition;

        let onMouseMove = (evt: MouseEvent) => {

            evt.stopImmediatePropagation();
            evt.preventDefault();

            this.handlDragEvent(evt);
        };
        let onMouseUp = (evt: MouseEvent) => {



            this.handlDragEvent(evt);

            document.body.removeEventListener('mousemove', onMouseMove);
            document.body.removeEventListener('mouseup', onMouseUp);



            document.body.style.webkitUserSelect = null;
        };

        document.body.addEventListener('mousemove', onMouseMove);
        document.body.addEventListener('mouseup', onMouseUp);
    };

    private calcShelterOffset(p: Point, rect: Rect): Point {

        let delta = new Point(Math.abs(rect.x1 - p.x), Math.abs(rect.y2 - p.y));
        let distance = Math.sqrt(delta.x * delta.x + delta.y * delta.y);
        let ratio = distance / this._callout.connector.anchor.shelterRadius;
        let offset = delta.multiply(1 / ratio);
        return offset;
    }

    public calculateLayout(currentRect: Rect = null): void {

        let anchorCenter = this._callout.connector.anchor.view.layoutData.rect.center;

        let viewPos = anchorCenter.add(this._relativePosition);
        //console.log(viewPos);

        currentRect = Rect.fromBounds(relBounds(this._callout.container, this._bodyContainerEl));
        let targetRect = currentRect.moveTo(viewPos);

        let containerRect = Rect.fromBounds(relBounds(this._callout.container, this._callout.container));
        if (0 > targetRect.x1) targetRect.x1 = 0;
        if (targetRect.x2 > containerRect.x2) targetRect.x1 = containerRect.x2 - targetRect.width;
        if (0 > targetRect.y1) targetRect.y1 = 0;
        if (targetRect.y2 > containerRect.y2) targetRect.y2 = containerRect.y2 - targetRect.height;

        //console.log(targetRect);

        this._layoutData.quadrant = this.calcQuadrant(targetRect);
        this._layoutData.rect = targetRect; // this.protectShelter(anchorCenter, targetRect, this._layoutData.quadrant);
        this._layoutData.closestPoint = this.calcClosestPoint(targetRect);
    }

    public updateLayout(): void {

        this._bodyContainerEl.style.left = this._layoutData.rect.x1 + 'px';
        this._bodyContainerEl.style.top = this._layoutData.rect.y1 + 'px';

        this.setWeldClasses();
    }

    private checkBorderCollision(rect: Rect): boolean {

        let containerBounds = this._callout.container.getBoundingClientRect();

        return !(0 <= rect.x1 && rect.x2 < containerBounds.width && 0 <= rect.y1 && rect.y2 < containerBounds.height); // bounds.left < 0 || bounds.top < 0 || bounds.left + bounds.width > document.body.clientWidth || bounds.top + bounds.height > document.body.clientHeight; // bounds.right > document.body.clientWidth; // || bounds.top < 0 || bounds.y2 > document.body.clientHeight;
    }


    abstract calcQuadrant(rect: Rect): Direction;


    private protectShelter(anchorCenter: Point, viewRect: Rect, quadrant: Direction): Rect {

        let distance = this.calcAnchorDistance(anchorCenter, viewRect, quadrant);

        if (distance <= this._callout.connector.anchor.shelterRadius) {

            switch (quadrant) {
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
        return viewRect;
    }


    get layoutData(): BodyViewLayoutData {
        return this._layoutData;
    }


    public abstract fadeIn(): Promise<void>;

    public abstract fadeOut(): Promise<void>;

    private _currentWeldSide: Direction = Direction.North;

    private setWeldClasses() {

        let weldSide = this._callout.connector.weldingSeamView.weldSide;
        if (this._currentWeldSide != weldSide) {

            if (this._currentWeldSide != null) removeClass(this._bodyEl, 'weld-' + Direction[this._currentWeldSide].toLowerCase());
            this._currentWeldSide = weldSide;
            addClass(this._bodyEl, 'weld-' + Direction[this._currentWeldSide].toLowerCase());
        }
    }

    private handlDragEvent(evt: MouseEvent) {

        let containerBounds = this._callout.container.getBoundingClientRect();

        let dragDelta = new Point(evt.clientX, evt.clientY)
            .sub(new Point(containerBounds.left, containerBounds.top))
            .sub(this._dragStartPos);

        this._relativePosition = this._dragStartRelativePosition.add(dragDelta);

        this.calculateLayout();

        this.updateLayout();

        setTimeout(()=>{
            let rect = Rect.fromBounds(relBounds(this._callout.container, this._bodyEl));
            this._layoutData.fullSize = rect.dimension;

            this._callout.updatePosition(true);
        });

    }
}

export class DefaultBodyView extends BodyView {

    private animationRunning: boolean = false;

    constructor(callout: Callout) {

        super(callout);
        this._bodyEl.setAttribute('class', this._bodyEl.getAttribute('class') + ' default');

        let headerSection = new BodySection('header');
        let contentSection = new BodySection('body');

        this._sectionContainerEl.appendChild(headerSection.el);
        this._sectionContainerEl.appendChild(contentSection.el);

        this._sections.push(headerSection);
        this._sections.push(contentSection);
    }

    public calcWeldingPoint(bodyRect: Rect = null): Point {

        let direction = this.calcQuadrant(bodyRect);
        let anchorCenter = this._callout.connector.anchor.view.layoutData.rect.center;

        let weldingPoint = new Point(anchorCenter.x, anchorCenter.y);

        switch (direction) {
            case Direction.North: {
                weldingPoint.y = bodyRect.y2;
                break;
            }
            case Direction.NorthEast: {
                weldingPoint.x = bodyRect.x1;
                weldingPoint.y = bodyRect.y2;
                break;
            }
            case Direction.East: {
                weldingPoint.x = bodyRect.x1;
                break;
            }
            case Direction.SouthEast: {
                weldingPoint.x = bodyRect.x1;
                weldingPoint.y = bodyRect.y1;
                break;
            }
            case Direction.South: {
                weldingPoint.y = bodyRect.y1;
                break;
            }
            case Direction.SouthWest: {
                weldingPoint.x = bodyRect.x2;
                weldingPoint.y = bodyRect.y1;
                break;
            }
            case Direction.West: {
                weldingPoint.x = bodyRect.x2;
                break;
            }
            case Direction.NorthWest: {
                weldingPoint.x = bodyRect.x2;
                weldingPoint.y = bodyRect.y2;
                break;
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

        let anchorCenter = this._callout.connector.anchor.view.layoutData.rect.center;
        if (rect == null) rect = Rect.fromBounds(this.bounds);

        let direction: Direction;

        if (rect.x1 <= anchorCenter.x && anchorCenter.x < rect.x2) {

            direction = rect.y1 + rect.height < anchorCenter.y ? Direction.North : Direction.South;

        } else if (rect.y1 <= anchorCenter.y && anchorCenter.y < rect.y2) {

            direction = anchorCenter.x < rect.x1 ? Direction.East : Direction.West;

        } else if (anchorCenter.x < rect.x1 && anchorCenter.y > rect.y2) {

            direction = Direction.NorthEast;

        } else if (anchorCenter.x < rect.x1 && anchorCenter.y < rect.y1) {

            direction = Direction.SouthEast;

        } else if (anchorCenter.x > rect.x2 && anchorCenter.y < rect.y1) {

            direction = Direction.SouthWest;

        } else {

            direction = Direction.NorthWest;
        }

        return direction;
    }

    public fadeIn(): Promise<void> {

        return this.animate(true);
    }

    public fadeOut(): Promise<void> {


        return this.animate(false).then(() => {
            this.hide();
        });

    }

    animate(fadeIn: boolean): Promise<void> {

        this.animationRunning = true;

        return new Promise<void>((resolve, reject) => {

            let startTime = Date.now();
            let endTime = startTime + 200;

            let xOrigin: string = null;
            let yOrigin: string = null;

            let transformOrigin;

            let weldSide = this._callout.connector.weldingSeamView.layoutData.weldSide;

            if (weldSide == Direction.West) {

                transformOrigin = "left";

            } else if (weldSide == Direction.North) {

                transformOrigin = "top";

            } else if (weldSide == Direction.East) {

                transformOrigin = "right";

            } else {

                transformOrigin = "bottom";
            }

            this._sectionContainerEl.style.transformOrigin = transformOrigin;


            if (weldSide == Direction.East || weldSide == Direction.West) {
                this._sectionContainerEl.style.transform = 'translateX(' + (fadeIn ? (weldSide == Direction.East ? 100 : -100) : 0) + '%)';
            } else {
                this._sectionContainerEl.style.transform = 'translateY(' + (fadeIn ? (weldSide == Direction.South ? 100 : -100) : 0) + '%)';
            }

            let firstRun = true;

            let loop = () => {

                if (firstRun) {
                    this.show();
                    firstRun = false;
                }

                let now = Date.now();
                let scale = 0;

                if (now < endTime) {

                    let ratio = (now - startTime) / (endTime - startTime);
                    scale = fadeIn ? ratio : 1 - ratio;

                    requestAnimationFrame(loop);

                } else {

                    scale = fadeIn ? 1 : 0;
                    this._bodyEl.style.transform = null;
                    resolve();
                }

                let translateValue = (weldSide == Direction.East || weldSide == Direction.South ? 1 : -1) * (100 - (scale * 100));
                this._sectionContainerEl.style.transform = ((weldSide == Direction.East || weldSide == Direction.West) ? 'translateX(' : 'translateY(') + translateValue + '%)';


            };
            requestAnimationFrame(loop);

        });
    }
}

export class BodyViewLayoutData {

    public fullSize: Dimension;

    constructor(public rect: Rect = null, public quadrant: Direction = null, public closestPoint: Point = null) {

        if (rect == null) this.rect = new Rect();
        if (closestPoint == null) this.closestPoint = new Point();
    }
}