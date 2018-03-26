import {Callout} from "./callout";
import {Point} from "./utils";

export abstract class ConnectorView {

    protected _connectorEl: HTMLElement;

    protected _layoutData: ConnectorLayoutData = new ConnectorLayoutData();


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

    public abstract calculateLayout(): void;

    public abstract updateLayout(): void;
}

export class DefaultConnectorView extends ConnectorView {

    private _lineEl: HTMLElement;

    private _lineWidth: number = 2;
    private _scaleX: number = 0;

    constructor(_callout: Callout) {
        super(_callout);

        this._connectorEl = document.createElement('div');
        this._connectorEl.setAttribute('class', 'ac-connector default');

        this._lineEl = document.createElement('div');
        this._lineEl.setAttribute('class', 'line');
        this._connectorEl.appendChild(this._lineEl);

    }

    public calculateLayout() {

        this._layoutData.startPoint = this._callout.connector.anchor.view.center;
        this._layoutData.endPoint = this._callout.connector.weldingSeamView.layoutData.weldPoint;


        //console.log('start');
        //console.log(this._layoutData.startPoint);
        //console.log('end');
        //console.log(this._layoutData.endPoint);


        let a2b = this._layoutData.endPoint.sub(this._layoutData.startPoint);



        this._layoutData.length = Math.sqrt(a2b.x * a2b.x + a2b.y * a2b.y);

        let angle = Math.asin(a2b.y / this._layoutData.length);

        if (a2b.x < 0) angle = (-1 * Math.PI / 2) - (Math.PI / 2 + angle);
        this._layoutData.angle = angle;

    }

    public updateLayout() {

        this._lineEl.style.width = (this._layoutData.length  + this.lineWidth) + 'px';

        this._connectorEl.style.left = this._layoutData.startPoint.x + 'px';
        this._connectorEl.style.top = this._layoutData.startPoint.y + 'px';

        this.setScale(1);
    }

    private setScale(scaleX: number) {

        this._lineEl.style.transform = 'rotate(' + this._layoutData.angle + 'rad) scaleX(' + scaleX + ')';
    }


    animate(fadeIn: boolean): Promise<void> {

        return new Promise<void>((resolve, reject) => {

            let startTime = Date.now();
            let endTime = startTime + 200;

            if (fadeIn) this.setScale(0);

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

                this.setScale(this._scaleX);
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

    public get lineWidth(): number {

        return this._lineWidth;
    }


    public show(): void {
        super.show();
        if (this._lineWidth < 0) this._lineWidth = this._lineEl.getBoundingClientRect().height as number;
    }
}

export class ConnectorLayoutData {

    constructor(public startPoint: Point = null, public endPoint: Point = null, public angle: number = 0, public length: number = 0) {

        if (this.startPoint == null) this.startPoint = new Point();
        if (this.endPoint == null) this.endPoint = new Point();
    }
}