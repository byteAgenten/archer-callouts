import {AnchorView, DefaultAnchorView} from "./anchor-view";
import {Callout} from "./callout";
import {relPos} from "./utils";
export class Anchor {

    private _view:AnchorView;
    private _element:HTMLElement;
    private _shelterRadius:number = 50;

    constructor(protected _callout:Callout) {
        this._view = new DefaultAnchorView(_callout);
    }


    get element(): HTMLElement {
        return this._element;
    }

    set element(value: HTMLElement) {
        this._element = value;
    }


    get shelterRadius(): number {
        return this._shelterRadius;
    }

    get view(): AnchorView {
        return this._view;
    }

    updatePosition() {


        let pos = relPos(this._callout.container, this._element);

        let left = pos.x + 20;
        let top = pos.y - 20;

        this._view.moveTo(left, top);
    }

    public show():void {
        this._view.fadeIn();
    }

    public hide():void {
        this._view.fadeOut();
    }

    public isTooClose(bounds:ClientRect):boolean {



        let centerPoint = this.view.center;

        return false;

    }

}