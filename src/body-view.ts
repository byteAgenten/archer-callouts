import {Callout} from "./callout";
import {Point} from "./Point";
import {BodySection} from "./body-section";
export abstract class BodyView {

    protected _bodyEl: HTMLElement;

    protected _relativePosition:Point = new Point(50, -50);

    protected _sections: Array<BodySection> = [];

    private _mouseDownDestroyFn: any;
    private _mouseUpDestroyFn: any;
    private _mouseMoveDestroyFn: any;
    private _dragging: boolean = false;
    private _elDragStartPos: Point;

    private _dragStartPos: Point;


    constructor(protected _callout: Callout) {
        this._bodyEl = document.createElement('div');
        this._bodyEl.setAttribute('class', 'ac-callout-body');

    }

    public get bounds(): ClientRect {
        return this._bodyEl.getBoundingClientRect();
    }

    public abstract get weldingPoint(): Point;

    public get relativePosition():Point {
        return this._relativePosition;
    }

    public get sections(): Array<BodySection> {
        return this._sections;
    }

    public show(): void {
        document.body.appendChild(this._bodyEl);


        this._bodyEl.addEventListener('mousedown', this.onMouseDown);
    }


    onMouseDown = (evt) => {

        let anchorCenter = this._callout.connector.anchor.view.center;

        document.body.style.webkitUserSelect = 'none';

        this._dragStartPos = new Point(evt.clientX, evt.clientY);
        this._elDragStartPos = new Point(this._bodyEl.getBoundingClientRect().left, this._bodyEl.getBoundingClientRect().top);

        let onMouseMove = (evt: MouseEvent) => {

            let dragDelta = new Point(evt.clientX, evt.clientY).sub(this._dragStartPos);
            this._bodyEl.style.left = (this._elDragStartPos.x + dragDelta.x) + 'px';
            this._bodyEl.style.top = (this._elDragStartPos.y + dragDelta.y) + 'px';

            this._callout.updatePosition(true);
        };
        let onMouseUp = (evt: MouseEvent) => {

            this._relativePosition.x = this.bounds.left - anchorCenter.x;
            this._relativePosition.y = this.bounds.top - anchorCenter.y;

            document.body.removeEventListener('mousemove', onMouseMove);
            document.body.removeEventListener('mousup', onMouseUp);

            document.body.style.webkitUserSelect = null;
        };

        document.body.addEventListener('mousemove', onMouseMove);
        document.body.addEventListener('mouseup', onMouseUp);
    };

    public updatePosition():void {

        let anchorCenter = this._callout.connector.anchor.view.center;

        this._bodyEl.style.left = (anchorCenter.x + this._relativePosition.x) + 'px';
        this._bodyEl.style.top = (anchorCenter.y + this._relativePosition.y) + 'px';
    }


    public hide(): void {
        this._bodyEl.removeEventListener('mousedown', this.onMouseDown);
        this._bodyEl.remove();
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

        let anchorBounds = this._callout.connector.anchor.view.bounds;

        let anchorCenter = new Point(anchorBounds.left + anchorBounds.width / 2, anchorBounds.top + anchorBounds.height / 2);


        let bodyBounds = this.bounds;

        let weldingPoint = new Point(0, 0);

        weldingPoint.x = bodyBounds.left;

        if (bodyBounds.top <= anchorCenter.y && anchorCenter.y < bodyBounds.bottom) {
            weldingPoint.y = anchorCenter.y;
        } else {

            if (anchorCenter.y <= bodyBounds.bottom) {
                weldingPoint.y = bodyBounds.top;
            } else {
                weldingPoint.y = bodyBounds.bottom;
            }
        }

        if (bodyBounds.left <= anchorCenter.x && anchorCenter.x < bodyBounds.right) {
            weldingPoint.x = anchorCenter.x;
        } else {

            if (anchorCenter.x <= bodyBounds.left) {
                weldingPoint.x = bodyBounds.left;
            } else {
                weldingPoint.x = bodyBounds.right;
            }
        }
        return weldingPoint;
    }
}