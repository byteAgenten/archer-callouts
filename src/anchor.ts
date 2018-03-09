import {AnchorView, DefaultAnchorView} from "./anchor-view";
export class Anchor {

    private _view:AnchorView = new DefaultAnchorView();
    private _element:Element;


    get element(): Element {
        return this._element;
    }

    set element(value: Element) {
        this._element = value;
    }


    get view(): AnchorView {
        return this._view;
    }

    updatePosition() {

        let bounds = this._element.getBoundingClientRect();

        let left = bounds.right + 10;
        let top = bounds.top - 10;

        this._view.moveTo(left, top);
    }

    public show():void {
        this._view.fadeIn();
    }

    public hide():void {
        this._view.fadeOut();
    }

}