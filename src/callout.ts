import {Connector} from "./connector";
import {Body} from "./body";
import {updateNotifierCheck} from "tslint/lib/updateNotifier";
import {Anchor} from "./anchor";
import {BodySection} from "./body-section";

export class Callout {

    private _container: HTMLElement;
    private _connector: Connector;
    private _body: Body;
    private _visible: boolean = false;

    constructor(container: HTMLElement) {
        console.log('New callout');
        this._container = container != null ? container : document.body;
        this._connector = new Connector(this);
        this._body = new Body(this);
    }

    get container(): HTMLElement {
        return this._container;
    }

    get body(): Body {
        return this._body;
    }

    private bind(element: HTMLElement): void {
        this._connector.anchor.element = element;
    }

    public updatePosition(bodyDrag: boolean = false): void {

        this._connector.anchor.view.calculateLayout();
        if (!bodyDrag) this._body.view.calculateLayout();
        this._connector.weldingSeamView.calculateLayout();
        this._connector.view.calculateLayout();


        this._connector.anchor.view.updateLayout();
        this._connector.view.updateLayout();
        this._connector.weldingSeamView.updateLayout();
        if( !bodyDrag) this.body.view.updateLayout();
        this._connector.anchor.view.updateLayout();
    }

    public show(): void {


        this._body.view.show();
        this._connector.anchor.view.show();


        this.updatePosition();
        this.connector.anchor.view.fadeIn().then(() => {

            return this.connector.view.fadeIn();
        }).then(() => {

            return this.connector.weldingSeamView.fadeIn();
        }).then(() => {

            return this._body.view.fadeIn();
        });
        //this._connector.show();

        this._visible = true;
    }

    public hide(): void {

        this.body.view.fadeOut().then(() => {

            return this.connector.weldingSeamView.fadeOut();
        }).then(() => {

            return this.connector.view.fadeOut();
        }).then(() => {
            return this.connector.anchor.view.fadeOut();
        });


        this._visible = false;
    }


    get visible(): boolean {
        return this._visible;
    }

    public destory(): void {

    }

    public get connector(): Connector {
        return this._connector;
    }

    public get anchorBounds() {
        return this._connector.anchor.element.getBoundingClientRect();
    }

    public get sections(): Array<BodySection> {
        return this._body.view.sections;
    }
}
