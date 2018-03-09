import {addClass, removeClass} from "./utils";
import {Point} from "./Point";
export abstract class AnchorView {

    protected _anchorEl:HTMLElement;

    public moveTo(left: number, top: number) {

        this._anchorEl.style.left = left + 'px';
        this._anchorEl.style.top = top + 'px';
    }

    public show():void {
        document.body.appendChild(this._anchorEl);
    }

    public hide():void {
        this._anchorEl.remove();
    }

    get bounds():ClientRect {
        return this._anchorEl.getBoundingClientRect();
    }

    public abstract fadeIn():Promise<void>;
    public abstract fadeOut():Promise<void>;
    public abstract get center():Point;
}

export class DefaultAnchorView extends AnchorView {


    constructor() {
        super();
        this._anchorEl = document.createElement('div');
        this._anchorEl.setAttribute('class', 'ac-anchor default');
    }


    public get center(): Point {

        let b = this.bounds;
        return new Point(
            b.left + b.width/2,
            b.top + b.height/2
        );
    }

    public fadeIn(): Promise<void> {

        return new Promise<void>((resolve, reject) => {

            let onTransitioned = (evt)=> {
                console.log('transitionend');
                console.log(evt);
                this._anchorEl.removeEventListener('transitionend', onTransitioned);
                resolve();
            };
            this._anchorEl.addEventListener('transitionend', onTransitioned);

            this.show();
            setTimeout(()=>{
                addClass(this._anchorEl, 'visible');
            });
        });
    }

    public fadeOut(): Promise<void> {

        return new Promise<void>((resolve, reject) => {

            let onTransitioned = (evt) => {
                console.log('transitionend');
                console.log(evt);
                this._anchorEl.removeEventListener('transitionend', onTransitioned);
                resolve();
            };
            this._anchorEl.addEventListener('transitionend', onTransitioned);

            removeClass(this._anchorEl, 'visible');
        });
    }
}