import {Callout} from "./callout";
import {Point} from "./utils";

export abstract class ConnectorView {

    protected _connectorEl: HTMLElement;


    constructor(protected _callout: Callout) {

    }

    public show(): void {
        this._callout.container.appendChild(this._connectorEl);
    }

    public hide(): void {
        this._connectorEl.remove();
    }

    public abstract fadeIn(): Promise<void>;

    public abstract fadeOut(): Promise<void>;

    public abstract get lineWidth(): number;

    public abstract update(): void;
}

export class DefaultConnectorView extends ConnectorView {

    private _lineEl: HTMLElement;

    private _lineWidth: number = -1;
    private _rad: number = 0;
    private _anchorCenterPoint: Point;
    private _scaleX: number = 0;

    constructor(_callout: Callout) {
        super(_callout);

        this._connectorEl = document.createElement('div');
        this._connectorEl.setAttribute('class', 'ac-connector default');

        this._lineEl = document.createElement('div');
        this._lineEl.setAttribute('class', 'line');
        this._connectorEl.appendChild(this._lineEl);

    }

    animate(fadeIn: boolean): Promise<void> {

        return new Promise<void>((resolve, reject) => {

            let startTime = Date.now();
            let endTime = startTime + 200;

            let loop = () => {

                let now = Date.now();

                if (now < endTime) {

                    let ratio = (now - startTime) / (endTime - startTime);
                    this._scaleX = fadeIn ? ratio : 1 - ratio;
                    requestAnimationFrame(loop);

                } else {
                    this._scaleX = fadeIn ? 1 : 0;
                    resolve();
                }
                this.updateStyles();
            };
            requestAnimationFrame(loop);
        });
    }

    public fadeIn(): Promise<void> {

        this._scaleX = 0;
        this.updateStyles();
        this.show();

        return this.animate(true);
    }

    public fadeOut(): Promise<void> {

        return this.animate(false).then(() => {
            this.hide();
        });
    }

    public get lineWidth(): number {

        return this._lineWidth;
    }

    /**
     * Calculates the rotation degree 0=right, PI/2=top, PI=left, 1.5PI=bottom, 2PI = right
     */
    private calcRad() {

        let weldingPoint = this._callout.body.view.weldingPoint;
        //let anchorBounds = this._callout.connector.anchor.view.bounds;

        this._anchorCenterPoint = this._callout.connector.anchor.view.center;


        /*
        this._anchorCenterPoint = new Point(
            anchorBounds.left + anchorBounds.width / 2,
            anchorBounds.top + anchorBounds.height / 2
        );
        */

        let a = weldingPoint.x - this._anchorCenterPoint.x;
        let b = weldingPoint.y - this._anchorCenterPoint.y;

        let connectorLength = Math.sqrt(a * a + b * b);

        this._lineEl.style.width = (connectorLength + this.lineWidth) + 'px';


        let rad = Math.asin((weldingPoint.y - this._anchorCenterPoint.y) / connectorLength);

        if (a < 0) rad = (-1 * Math.PI / 2) - (Math.PI / 2 + rad);
        this._rad = rad;
    }

    update() {

        this.calcRad();
        this.updateStyles();

    }

    updateStyles() {

        this._lineEl.style.transform = 'rotate(' + this._rad + 'rad) scaleX(' + this._scaleX + ')';

        this._connectorEl.style.left = (this._anchorCenterPoint.x) + 'px';
        this._connectorEl.style.top = this._anchorCenterPoint.y + 'px';

    }

    public show(): void {
        super.show();
        if (this._lineWidth < 0) this._lineWidth = this._lineEl.getBoundingClientRect().height as number;
    }
}