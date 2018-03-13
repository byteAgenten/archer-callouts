var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { addClass, removeClass, Direction } from "./utils";
export var WeldingSeamView = (function () {
    function WeldingSeamView(_callout) {
        this._callout = _callout;
        this._el = document.createElement('div');
        this._el.setAttribute('class', 'ac-welding-seam');
    }
    WeldingSeamView.prototype.show = function () {
        this._callout.container.appendChild(this._el);
    };
    WeldingSeamView.prototype.hide = function () {
        this._el.remove();
    };
    return WeldingSeamView;
}());
export var DefaultWeldingSeamView = (function (_super) {
    __extends(DefaultWeldingSeamView, _super);
    function DefaultWeldingSeamView(_callout) {
        _super.call(this, _callout);
        this._callout = _callout;
        this._scale = 1;
        this._weldSide = Direction.West;
        addClass(this._el, 'default');
    }
    DefaultWeldingSeamView.prototype.animate = function (fadeIn) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var startTime = Date.now();
            var endTime = startTime + 200;
            var xOrigin = null;
            var yOrigin = null;
            if (_this._weldSide == Direction.West) {
                yOrigin = _this._transformOrigin == Direction.NorthWest ? 'top' : (_this._transformOrigin == Direction.SouthWest ? 'bottom' : 'center');
            }
            else if (_this._weldSide == Direction.North) {
                xOrigin = _this._transformOrigin == Direction.NorthWest ? 'left' : (_this._transformOrigin == Direction.NorthEast ? 'right' : 'center');
            }
            else if (_this._weldSide == Direction.East) {
                yOrigin = _this._transformOrigin == Direction.SouthEast ? 'bottom' : (_this._transformOrigin == Direction.NorthEast ? 'top' : 'center');
            }
            else {
                xOrigin = _this._transformOrigin == Direction.SouthEast ? 'right' : (_this._transformOrigin == Direction.SouthWest ? 'left' : 'center');
            }
            if (xOrigin != null) {
                _this._el.style.transformOrigin = xOrigin + ' top';
            }
            else {
                _this._el.style.transformOrigin = 'left ' + yOrigin;
            }
            if (_this._weldSide == Direction.East || _this._weldSide == Direction.West) {
                _this._el.style.transform = fadeIn ? 'scaleY(0)' : 'scaleY(1)';
            }
            else {
                _this._el.style.transform = fadeIn ? 'scaleX(0)' : 'scaleX(1)';
            }
            var loop = function () {
                var now = Date.now();
                if (now < endTime) {
                    var ratio = (now - startTime) / (endTime - startTime);
                    _this._scale = fadeIn ? ratio : 1 - ratio;
                    requestAnimationFrame(loop);
                }
                else {
                    _this._scale = fadeIn ? 1 : 0;
                    _this._el.style.transform = null;
                    resolve();
                }
                _this._el.style.transform = ((_this._weldSide == Direction.East || _this._weldSide == Direction.West) ? 'scaleY(' : 'scaleX(') + _this._scale + ')';
            };
            requestAnimationFrame(loop);
        });
    };
    DefaultWeldingSeamView.prototype.fadeIn = function () {
        this.show();
        return this.animate(true);
    };
    DefaultWeldingSeamView.prototype.fadeOut = function () {
        var _this = this;
        return this.animate(false).then(function () {
            _this.hide();
        });
    };
    DefaultWeldingSeamView.prototype.update = function () {
        var anchorBounds = this._callout.connector.anchor.view.bounds;
        var bodyBounds = this._callout.body.bounds;
        var weldingPoint = this._callout.body.view.weldingPoint;
        var anchorPoint = this._callout.connector.anchor.view.center;
        var a = weldingPoint.x - anchorPoint.x;
        var b = weldingPoint.y - anchorPoint.y;
        var rad = Math.asin((weldingPoint.y - anchorPoint.y) / Math.sqrt(a * a + b * b));
        var weldSide = null;
        this._el.style.right = null;
        this._el.style.bottom = null;
        this._el.style.top = null;
        this._el.style.left = null;
        this._el.style.width = null;
        this._el.style.height = null;
        if (anchorBounds.left + anchorBounds.width < bodyBounds.left) {
            if (rad < -1 * Math.PI / 4) {
                this._transformOrigin = Direction.SouthWest;
                weldSide = Direction.South;
                this._el.style.top = (bodyBounds.top + bodyBounds.height - this._callout.connector.view.lineWidth) + 'px';
                this._el.style.width = bodyBounds.width + 'px';
                this._el.style.left = bodyBounds.left + 'px';
            }
            else if (rad > Math.PI / 4) {
                this._transformOrigin = Direction.NorthWest;
                weldSide = Direction.North;
                this._el.style.top = bodyBounds.top + 'px';
                this._el.style.width = bodyBounds.width + 'px';
                this._el.style.left = bodyBounds.left + 'px';
            }
            else {
                var b_1 = this._callout.body.view.bounds;
                var anchorCenter = this._callout.connector.anchor.view.center;
                this._transformOrigin = anchorCenter.y > b_1.top + b_1.height ? Direction.SouthWest : (anchorCenter.y < b_1.top ? Direction.NorthWest : Direction.West);
                weldSide = Direction.West;
                this._el.style.top = bodyBounds.top + 'px';
                this._el.style.height = bodyBounds.height + 'px';
                this._el.style.left = bodyBounds.left + 'px';
            }
        }
        else {
            if (rad < -1 * Math.PI / 4) {
                this._transformOrigin = Direction.SouthEast;
                weldSide = Direction.South;
                this._el.style.top = (bodyBounds.top + bodyBounds.height - this._callout.connector.view.lineWidth) + 'px';
                this._el.style.width = bodyBounds.width + 'px';
                this._el.style.left = bodyBounds.left + 'px';
            }
            else if (rad > Math.PI / 4) {
                this._transformOrigin = Direction.NorthEast;
                weldSide = Direction.North;
                this._el.style.top = (bodyBounds.top) + 'px';
                this._el.style.width = bodyBounds.width + 'px';
                this._el.style.left = bodyBounds.left + 'px';
            }
            else {
                var b_2 = this._callout.body.view.bounds;
                var anchorCenter = this._callout.connector.anchor.view.center;
                this._transformOrigin = anchorCenter.y > b_2.top + b_2.height ? Direction.SouthEast : (anchorCenter.y < b_2.top ? Direction.NorthEast : Direction.East);
                weldSide = Direction.East;
                this._el.style.top = (bodyBounds.top) + 'px';
                this._el.style.height = bodyBounds.height + 'px';
                this._el.style.left = (bodyBounds.left + bodyBounds.width - this._callout.connector.view.lineWidth) + 'px';
            }
        }
        if (this._weldSide != weldSide) {
            removeClass(this._el, Direction[this._weldSide].toLowerCase());
            addClass(this._el, Direction[weldSide].toLowerCase());
            this._weldSide = weldSide;
        }
    };
    return DefaultWeldingSeamView;
}(WeldingSeamView));
//# sourceMappingURL=/Users/matthias/Development/Projects/archer-callouts/src/welding-seam-view.js.map