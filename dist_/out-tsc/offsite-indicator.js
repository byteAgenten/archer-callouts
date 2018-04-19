import { addClass, relBounds, Rect, Direction, Point, removeClass } from "./utils";
export var OffSiteIndicator = (function () {
    function OffSiteIndicator(_callout) {
        this._callout = _callout;
        this._layoutData = new OffSiteIndicatorLayoutData();
        this._lastDirection = null;
        this._el = document.createElement('div');
        this._nose = document.createElement('div');
        this._body = document.createElement('div');
        this._el.appendChild(this._nose);
        this._el.appendChild(this._body);
        addClass(this._el, 'off-site-indicator');
        addClass(this._nose, 'nose');
        addClass(this._body, 'body');
        this.html = 'hello';
    }
    OffSiteIndicator.prototype.calculateLayout = function () {
        var containerRect = Rect.fromBounds(relBounds(this._callout.container, this._callout.container));
        var anchorCenter = this._callout.connector.anchor.view.layoutData.rect.center;
        var indicatorRect = Rect.fromBounds(relBounds(this._callout.container, this._el));
        this._layoutData.point.x = anchorCenter.x - indicatorRect.width / 2;
        this._layoutData.point.y = anchorCenter.y - indicatorRect.height / 2;
        var minLeft = 0;
        var minTop = 0;
        var maxRight = containerRect.width - this._el.getBoundingClientRect().width;
        var maxBottom = containerRect.height - this._el.getBoundingClientRect().height;
        if (this._layoutData.point.x < minLeft) {
            this._layoutData.point.x = minLeft;
            this._layoutData.direction = Direction.West;
        }
        if (this._layoutData.point.x > maxRight) {
            this._layoutData.point.x = maxRight;
            this._layoutData.direction = Direction.East;
        }
        if (this._layoutData.point.y < minTop) {
            this._layoutData.point.y = minTop;
            this._layoutData.direction = Direction.North;
        }
        if (this._layoutData.point.y > maxBottom) {
            this._layoutData.point.y = maxBottom;
            this._layoutData.direction = Direction.South;
        }
        //if(this._layoutData.direction != null) console.log(Direction[this._layoutData.direction].toLowerCase());
    };
    OffSiteIndicator.prototype.updateLayout = function () {
        this._el.style.left = this._layoutData.point.x + 'px';
        this._el.style.top = this._layoutData.point.y + 'px';
        if (this._layoutData.direction != this._lastDirection) {
            if (this._lastDirection != null) {
                removeClass(this._el, Direction[this._lastDirection].toLowerCase());
            }
            if (this._layoutData.direction != null) {
                addClass(this._el, Direction[this._layoutData.direction].toLowerCase());
            }
            this._lastDirection = this._layoutData.direction;
        }
    };
    Object.defineProperty(OffSiteIndicator.prototype, "html", {
        get: function () {
            return this._el.innerHTML;
        },
        set: function (html) {
            this._body.innerHTML = html;
        },
        enumerable: true,
        configurable: true
    });
    OffSiteIndicator.prototype.addToStage = function () {
        this._callout.container.appendChild(this._el);
        this._el.style.visibility = 'hidden';
        this._el.style.transform = 'scale(1)';
    };
    OffSiteIndicator.prototype.removeFromStage = function () {
        this._el.remove();
    };
    OffSiteIndicator.prototype.show = function () {
        var _this = this;
        this._el.style.visibility = 'visible';
        addClass(this._el, 'hidden');
        setTimeout(function () {
            removeClass(_this._el, 'hidden');
        });
    };
    OffSiteIndicator.prototype.hide = function () {
        this._el.addEventListener('transitionend', this.onTransitionEnd);
        addClass(this._el, 'hidden');
    };
    OffSiteIndicator.prototype.onTransitionEnd = function () {
        this._el.removeEventListener('transitionend', this.onTransitionEnd);
        removeClass(this._el, 'hidden');
    };
    ;
    return OffSiteIndicator;
}());
export var OffSiteIndicatorLayoutData = (function () {
    function OffSiteIndicatorLayoutData(direction, point) {
        if (direction === void 0) { direction = null; }
        if (point === void 0) { point = null; }
        this.direction = direction;
        this.point = point;
        if (this.point == null)
            this.point = new Point();
    }
    return OffSiteIndicatorLayoutData;
}());
//# sourceMappingURL=/Users/matthias/Development/Projects/archer-callouts/src/offsite-indicator.js.map