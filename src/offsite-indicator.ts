import {addClass, relBounds, Rect, Direction, Point} from "./utils";
import {Callout} from "./callout";
export class OffSiteIndicator {

    private _htmlContent: string;
    private el: HTMLElement;
    private layoutData: OffSiteIndicatorLayoutData = new OffSiteIndicatorLayoutData();

    constructor(private _callout: Callout) {
        this.el = document.createElement('div');
        addClass(this.el, 'off-site-indicator');
        this.html = 'hello';
    }

    public updatePosition(): void {

        let containerRect = Rect.fromBounds(relBounds(this._callout.container, this._callout.container));
        let anchorCenter = this._callout.connector.anchor.view.layoutData.rect.center;
        console.log(anchorCenter);

        let a1 = containerRect.height / containerRect.width;

        let x = anchorCenter.x - containerRect.center.x;
        let y = containerRect.center.y - anchorCenter.y;
        let a2 = y / 2;


        if (anchorCenter.x > containerRect.center.x) {

            if (anchorCenter.y > containerRect.center.y) {

                this.layoutData.direction = a2 > -1 * a1 ? Direction.East : Direction.South;

            } else {

                this.layoutData.direction = a2 > a1 ? Direction.North : Direction.East;

            }
        } else {

            if (containerRect.center.y > anchorCenter.y) {

                this.layoutData.direction = a2 > -1 * a1 ? Direction.West : Direction.North;

            } else {

                this.layoutData.direction = a2 > a1 ? Direction.South : Direction.West;
            }
        }

        switch (this.layoutData.direction) {
            case Direction.North: {
                this.layoutData.point.x = anchorCenter.x < 0 ? 0 : (anchorCenter.x > containerRect.width ? containerRect.width : anchorCenter.x);
                this.layoutData.point.y = 0;
                break;
            }
            case Direction.West: {
                this.layoutData.point.x = containerRect.width;
                this.layoutData.point.y = anchorCenter.y < 0 ? 0 : (anchorCenter.y > containerRect.height ? containerRect.height : anchorCenter.y);
                break;
            }
            case Direction.South: {
                this.layoutData.point.x = anchorCenter.x < 0 ? 0 : (anchorCenter.x > containerRect.width ? containerRect.width : anchorCenter.x);
                this.layoutData.point.y = containerRect.height;
                break;
            }
            case Direction.East: {
                this.layoutData.point.x = 0;
                this.layoutData.point.y = anchorCenter.y < 0 ? 0 : (anchorCenter.y > containerRect.height ? containerRect.height : anchorCenter.y);
                break;
            }
        }
    }

    public set html(html: string) {
        this.el.innerHTML = html;
    }

    public get html(): string {
        return this.el.innerHTML;
    }

    public show(): void {

        this._callout.container.appendChild(this.el);
    }

    public hide(): void {

        this.el.remove();
    }
}

export class OffSiteIndicatorLayoutData {

    constructor(public direction: Direction = null, public point: Point = null) {
        if (point == null) point = new Point();
    }
}