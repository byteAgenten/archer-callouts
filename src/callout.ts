import {Connector} from "./connector";
import {Body} from "./body";
import {updateNotifierCheck} from "tslint/lib/updateNotifier";
import {Anchor} from "./anchor";
import {BodySection} from "./body-section";
import {relPos, relBounds, Rect} from "./utils";
import {OffSiteIndicator} from "./offsite-indicator";
import {CalloutConfig} from "./callout-config";

export class Callout {

    private _container: HTMLElement;
    private _connector: Connector;
    private _body: Body;
    private _visible: boolean = false;
    private _offSiteIndicator: OffSiteIndicator;

    private _config:CalloutConfig;

    constructor(container: HTMLElement, config:CalloutConfig = null) {

        this._config = config != null ? config : new CalloutConfig();
        this._container = container != null ? container : document.body;
        this._connector = new Connector(this);
        this._body = new Body(this);
        this._offSiteIndicator = new OffSiteIndicator(this);
    }

    get config():CalloutConfig {
        return this._config;
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

    get offSiteHtml(): string {
        return this._offSiteIndicator.html;
    }

    set offSiteHtml(html: string) {
        this._offSiteIndicator.html = html;
    }

    private isInViewPort: boolean = null;

    private calculateLayout(bodyDrag: boolean = false): void {

        this._connector.anchor.view.calculateLayout();

        if (!bodyDrag) this._body.view.calculateLayout();
        this._connector.weldingSeamView.calculateLayout();
        this._connector.view.calculateLayout();
        this._offSiteIndicator.calculateLayout();
    }

    private updateLayout(bodyDrag: boolean = false): void {

        this._connector.anchor.view.updateLayout();
        this._connector.view.updateLayout();
        this._connector.weldingSeamView.updateLayout();
        if (!bodyDrag) this.body.view.updateLayout();
        this._offSiteIndicator.updateLayout();
    }


    public updatePosition(bodyDrag: boolean = false, show: boolean = true): void {

        this.calculateLayout(bodyDrag);

        let isAnchorInViewPort = this.isAnchorInViewPort();
        //console.log('inViewPort: ' + isAnchorInViewPort);

        if (show) {
            if (isAnchorInViewPort != this.isInViewPort) {
                if (isAnchorInViewPort) {

                    this._connector.anchor.view.show();
                    this._connector.view.show();
                    this._connector.weldingSeamView.show();
                    this.body.view.show();

                    this._offSiteIndicator.hide();

                } else {

                    this._connector.view.hide();
                    this._connector.anchor.view.hide();
                    this._connector.weldingSeamView.hide();
                    this.body.view.hide();

                    this._offSiteIndicator.show();

                }

            }
        }
        this.isInViewPort = isAnchorInViewPort;

        this.updateLayout(bodyDrag);

        /*

         if (isAnchorInViewPort) {

         this._connector.anchor.view.updateLayout();
         this._connector.view.updateLayout();
         this._connector.weldingSeamView.updateLayout();
         if (!bodyDrag) this.body.view.updateLayout();

         } else {

         this._offSiteIndicator.calculateLayout();
         this._offSiteIndicator.updateLayout();
         }
         */
    }

    private isAnchorInViewPort(): boolean {

        let anchorRect = this._connector.anchor.view.layoutData.rect;
        let containerRect = Rect.fromBounds(relBounds(this._container, this._container));
        //console.log(containerRect);
        //console.log(anchorRect);
        //console.log('________x______')
        return containerRect.contains(anchorRect);

    }

    public show(): void {


        this._body.view.addToStage();
        this._connector.anchor.view.addToStage();
        this._connector.view.addToStage();
        this._connector.weldingSeamView.addToStage();
        this._offSiteIndicator.addToStage();

        this.updatePosition(false, false);

        this.isInViewPort = this.isAnchorInViewPort();

        if (this.isInViewPort) {

            this.connector.anchor.view.fadeIn().then(() => {

                return this.connector.view.fadeIn();
            }).then(() => {

                return this.connector.weldingSeamView.fadeIn();
            }).then(() => {

                return this._body.view.fadeIn();
            });
        } else {

            this._offSiteIndicator.show();
        }

        this._visible = true;
    }

    private removeFromStage():void {

        this.body.view.removeFromStage();
        this.connector.weldingSeamView.removeFromStage();
        this.connector.view.removeFromStage();
        this.connector.anchor.view.removeFromStage();
    }

    public hide(): void {


        if (this.isInViewPort) {

            this.body.view.fadeOut().then(() => {

                return this.connector.weldingSeamView.fadeOut();
            }).then(() => {

                return this.connector.view.fadeOut();
            }).then(() => {
                return this.connector.anchor.view.fadeOut();
            }).then(()=> {
                this.removeFromStage();
            });

        } else {

            this.removeFromStage();
        }

        this._offSiteIndicator.removeFromStage();

        this.isInViewPort = null;
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
