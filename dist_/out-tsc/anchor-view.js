var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { addClass, removeClass, relBounds, Point } from "./utils";
export var AnchorView = (function () {
    function AnchorView(_callout) {
        this._callout = _callout;
    }
    AnchorView.prototype.moveTo = function (left, top) {
        this._anchorEl.style.left = left + 'px';
        this._anchorEl.style.top = top + 'px';
    };
    AnchorView.prototype.show = function () {
        this._callout.container.appendChild(this._anchorEl);
    };
    AnchorView.prototype.hide = function () {
        this._anchorEl.remove();
    };
    Object.defineProperty(AnchorView.prototype, "bounds", {
        get: function () {
            return relBounds(this._callout.container, this._anchorEl);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnchorView.prototype, "center", {
        get: function () { },
        enumerable: true,
        configurable: true
    });
    return AnchorView;
}());
export var DefaultAnchorView = (function (_super) {
    __extends(DefaultAnchorView, _super);
    function DefaultAnchorView(callout) {
        _super.call(this, callout);
        this._anchorEl = document.createElement('div');
        this._anchorEl.setAttribute('class', 'ac-anchor default');
    }
    Object.defineProperty(DefaultAnchorView.prototype, "center", {
        get: function () {
            var b = this.bounds;
            return new Point(b.left + b.width / 2, b.top + b.height / 2);
        },
        enumerable: true,
        configurable: true
    });
    DefaultAnchorView.prototype.fadeIn = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var onTransitioned = function (evt) {
                console.log('transitionend');
                console.log(evt);
                _this._anchorEl.removeEventListener('transitionend', onTransitioned);
                resolve();
            };
            _this._anchorEl.addEventListener('transitionend', onTransitioned);
            _this.show();
            setTimeout(function () {
                addClass(_this._anchorEl, 'visible');
            });
        });
    };
    DefaultAnchorView.prototype.fadeOut = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var onTransitioned = function (evt) {
                console.log('transitionend');
                console.log(evt);
                _this._anchorEl.removeEventListener('transitionend', onTransitioned);
                resolve();
            };
            _this._anchorEl.addEventListener('transitionend', onTransitioned);
            removeClass(_this._anchorEl, 'visible');
        });
    };
    return DefaultAnchorView;
}(AnchorView));
//# sourceMappingURL=/Users/matthias/Development/Projects/archer-callouts/src/anchor-view.js.map