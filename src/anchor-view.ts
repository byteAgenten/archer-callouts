import {addClass, removeClass, relBounds, Point, Rect} from "./utils";

import {Callout} from "./callout";
export abstract class AnchorView {

    protected _anchorEl: HTMLElement;

    protected _layoutData: AnchorLayoutData = new AnchorLayoutData();

    protected _offset:Point = new Point(0, 0);

    constructor(protected _callout: Callout) {
        this._anchorEl = document.createElement('div');
        this._anchorEl.setAttribute('class', 'ac-anchor');
    }

    public show(): void {
        this._callout.container.appendChild(this._anchorEl);
        this._anchorEl.style.visibility = 'hidden';
        this._anchorEl.style.transform = 'scale(1)';
    }

    public hide(): void {
        this._anchorEl.remove();
    }

    get bounds(): ClientRect {
        return relBounds(this._callout.container, this._anchorEl);
    }

    public calculateLayout(): void {

        this._layoutData.boundElementRect = Rect.fromBounds(relBounds(this._callout.container, this._callout.connector.anchor.element));

        let anchorCenter = new Point(
            this._layoutData.boundElementRect.x2 + this._offset.x,
            this._layoutData.boundElementRect.y1 + this._offset.y
        );

        this._layoutData.rect = Rect.fromBounds(relBounds(this._callout.container, this._anchorEl));

        this._layoutData.rect.x1 = anchorCenter.x - this._layoutData.rect.width/2;
        this._layoutData.rect.y1 = anchorCenter.y - this._layoutData.rect.height/2;
    }

    public updateLayout(): void {

        this._anchorEl.style.left = this._layoutData.rect.x1 + 'px';
        this._anchorEl.style.top = this._layoutData.rect.y1 + 'px';
    }

    public abstract fadeIn(): Promise<void>;

    public abstract fadeOut(): Promise<void>;

    public abstract get center(): Point;
}

export class DefaultAnchorView extends AnchorView {


    constructor(callout: Callout) {
        super(callout);
        addClass(this._anchorEl, 'default');

        let innerCircle = document.createElement('div');
        addClass(innerCircle, 'inner-circle');

        let outerCircle = document.createElement('div');
        addClass(outerCircle, 'outer-circle');

        this._anchorEl.appendChild(outerCircle);
        this._anchorEl.appendChild(innerCircle);

    }


    public get center(): Point {

        return Rect.fromBounds(this.bounds).center;
    }

    private _scale:number = 0;

    private setScale(scale: number) {

        this._anchorEl.style.transform = 'scale(' + scale + ')';
    }

    private animate(fadeIn:boolean):Promise<void> {

        return new Promise<void>((resolve, reject) => {

            let startTime = Date.now();
            let endTime = startTime + 200;

            if (fadeIn) this._anchorEl.style.visibility = 'visible';

            let loop = () => {

                let now = Date.now();

                if (now < endTime) {

                    let ratio = (now - startTime) / (endTime - startTime);
                    this._scale = fadeIn ? ratio : 1 - ratio;
                    requestAnimationFrame(loop);

                } else {
                    this._scale = fadeIn ? 1 : 0;
                    resolve();
                }

                this.setScale(this._scale);
            };
            requestAnimationFrame(loop);
        });
    }

    public fadeIn(): Promise<void> {

        return this.animate(true);

    }

    public fadeOut(): Promise<void> {

        return this.animate(false);
    }


}

export class AnchorLayoutData {

    constructor(public rect: Rect = null, public boundElementRect: Rect = null) {
        if (this.rect == null) this.rect = new Rect();
        if (this.boundElementRect == null) this.boundElementRect = new Rect();
    }
}