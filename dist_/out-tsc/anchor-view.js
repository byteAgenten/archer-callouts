var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { addClass, relBounds, Point, Rect } from "./utils";
export var AnchorView = (function () {
    function AnchorView(_callout) {
        this._callout = _callout;
        this._layoutData = new AnchorLayoutData();
        this._offset = new Point(0, 0);
        this._anchorEl = document.createElement('div');
        this._anchorEl.setAttribute('class', 'ac-anchor');
    }
    AnchorView.prototype.addToStage = function () {
        this._callout.container.appendChild(this._anchorEl);
        this.hide();
        this._anchorEl.style.transform = 'scale(1)';
    };
    AnchorView.prototype.removeFromStage = function () {
        this._anchorEl.remove();
    };
    AnchorView.prototype.show = function () {
        this._anchorEl.style.visibility = 'visible';
    };
    AnchorView.prototype.hide = function () {
        this._anchorEl.style.visibility = 'hidden';
    };
    Object.defineProperty(AnchorView.prototype, "layoutData", {
        get: function () {
            return this._layoutData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnchorView.prototype, "bounds", {
        get: function () {
            return relBounds(this._callout.container, this._anchorEl);
        },
        enumerable: true,
        configurable: true
    });
    AnchorView.prototype.calculateLayout = function () {
        this._layoutData.boundElementRect = Rect.fromBounds(relBounds(this._callout.container, this._callout.connector.anchor.element));
        var anchorCenter = new Point(this._layoutData.boundElementRect.x2 + this._offset.x, this._layoutData.boundElementRect.y1 + this._offset.y);
        //let r = this._anchorEl.getBoundingClientRect();
        //console.log(r);
        this._layoutData.rect = Rect.fromBounds(relBounds(this._callout.container, this._anchorEl));
        //console.log('rect: ' + anchorCenter.x + '/' + anchorCenter.y + '   ' + this._layoutData.rect.width + '/' + this._layoutData.rect.height);
        this._layoutData.rect.x1 = anchorCenter.x - this._layoutData.rect.width / 2;
        this._layoutData.rect.y1 = anchorCenter.y - this._layoutData.rect.height / 2;
        //console.log(this._layoutData.rect);
    };
    AnchorView.prototype.updateLayout = function () {
        //console.log('pos: ' + this._layoutData.rect.x1 + '/' + this._layoutData.rect.y1);
        this._anchorEl.style.left = this._layoutData.rect.x1 + 'px';
        this._anchorEl.style.top = this._layoutData.rect.y1 + 'px';
    };
    return AnchorView;
}());
export var DefaultAnchorView = (function (_super) {
    __extends(DefaultAnchorView, _super);
    function DefaultAnchorView(callout) {
        _super.call(this, callout);
        this._scale = 0;
        addClass(this._anchorEl, 'default');
        var innerCircle = document.createElement('div');
        addClass(innerCircle, 'inner-circle');
        var outerCircle = document.createElement('div');
        addClass(outerCircle, 'outer-circle');
        this._anchorEl.appendChild(outerCircle);
        this._anchorEl.appendChild(innerCircle);
    }
    DefaultAnchorView.prototype.setScale = function (scale) {
        this._anchorEl.style.transform = 'scale(' + scale + ')';
    };
    DefaultAnchorView.prototype.animate = function (fadeIn) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var startTime = Date.now();
            var endTime = startTime + 400;
            if (fadeIn)
                _this._anchorEl.style.visibility = 'visible';
            var loop = function () {
                var now = Date.now();
                if (now < endTime) {
                    var ratio = (now - startTime) / (endTime - startTime);
                    _this._scale = fadeIn ? ratio : 1 - ratio;
                    requestAnimationFrame(loop);
                }
                else {
                    _this._scale = fadeIn ? 1 : 0;
                    resolve();
                }
                _this.setScale(_this._scale);
            };
            requestAnimationFrame(loop);
        });
    };
    DefaultAnchorView.prototype.fadeIn = function () {
        this._anchorEl.style.visibility = 'visible';
        return this.animate(true);
    };
    DefaultAnchorView.prototype.fadeOut = function () {
        var _this = this;
        return this.animate(false).then(function () {
            _this.removeFromStage();
        });
    };
    return DefaultAnchorView;
}(AnchorView));
export var AnchorLayoutData = (function () {
    function AnchorLayoutData(rect, boundElementRect) {
        if (rect === void 0) { rect = null; }
        if (boundElementRect === void 0) { boundElementRect = null; }
        this.rect = rect;
        this.boundElementRect = boundElementRect;
        if (this.rect == null)
            this.rect = new Rect();
        if (this.boundElementRect == null)
            this.boundElementRect = new Rect();
    }
    return AnchorLayoutData;
}());
//# sourceMappingURL=/Users/matthias/Development/Projects/archer-callouts/src/anchor-view.js.map