var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { addClass, removeClass, Direction, Rect, Point } from "./utils";
export var WeldingSeamView = (function () {
    function WeldingSeamView(_callout) {
        this._callout = _callout;
        this._layoutData = new WeldLayoutData();
        this._el = document.createElement('div');
        this._el.setAttribute('class', 'ac-welding-seam');
    }
    WeldingSeamView.prototype.addToStage = function () {
        this._callout.container.appendChild(this._el);
        this.hide();
        this._el.style.transform = 'scale(1)';
    };
    WeldingSeamView.prototype.removeFromStage = function () {
        this._el.remove();
    };
    WeldingSeamView.prototype.show = function () {
        this._el.style.visibility = 'visible';
    };
    WeldingSeamView.prototype.hide = function () {
        this._el.style.visibility = 'hidden';
    };
    Object.defineProperty(WeldingSeamView.prototype, "layoutData", {
        get: function () {
            return this._layoutData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WeldingSeamView.prototype, "weldSide", {
        get: function () { },
        enumerable: true,
        configurable: true
    });
    return WeldingSeamView;
}());
export var DefaultWeldingSeamView = (function (_super) {
    __extends(DefaultWeldingSeamView, _super);
    function DefaultWeldingSeamView(_callout) {
        _super.call(this, _callout);
        this._callout = _callout;
        this._scale = 1;
        addClass(this._el, 'default');
    }
    Object.defineProperty(DefaultWeldingSeamView.prototype, "weldSide", {
        get: function () {
            return this._layoutData.weldSide;
        },
        enumerable: true,
        configurable: true
    });
    DefaultWeldingSeamView.prototype.calculateLayout = function () {
        var anchorCenter = this._callout.connector.anchor.view.layoutData.rect.center;
        var bodyRect = this._callout.body.view.layoutData.rect;
        //bodyFullSize is needed in case of fadeOut sequence! bodyRect.width will be 0 at the end of the fadeOut sequence.
        //This would lead to wrong calculation results here. Therefore we have to know what was the dimension
        //of the document before fadeOut sequence started.
        var bodyFullSize = this._callout.body.view.layoutData.fullSize;
        this._layoutData.weldPoint = this._callout.body.view.layoutData.closestPoint;
        var layoutData = new WeldLayoutData();
        var a = this._layoutData.weldPoint.x - anchorCenter.x;
        var b = this._layoutData.weldPoint.y - anchorCenter.y;
        layoutData.angle = Math.asin(b / Math.sqrt(a * a + b * b));
        if (anchorCenter.x < bodyRect.x2 - bodyRect.width / 2) {
            if (layoutData.angle < -1 * Math.PI / 4) {
                layoutData.transformOrigin = Direction.SouthWest;
                layoutData.weldSide = Direction.South;
                if (bodyRect.x1 > anchorCenter.x) {
                    layoutData.weldPoint = new Point(bodyRect.x1, bodyRect.y2);
                }
                else {
                    layoutData.weldPoint = new Point(anchorCenter.x, bodyRect.y2);
                }
                layoutData.rect = new Rect(bodyRect.x1, bodyRect.y2 - this._callout.connector.view.lineWidth, bodyFullSize.width, this._callout.connector.view.lineWidth);
            }
            else if (layoutData.angle > Math.PI / 4) {
                layoutData.transformOrigin = Direction.NorthWest;
                layoutData.weldSide = Direction.North;
                if (bodyRect.x1 > anchorCenter.x) {
                    layoutData.weldPoint = new Point(bodyRect.x1, bodyRect.y1);
                }
                else {
                    layoutData.weldPoint = new Point(anchorCenter.x, bodyRect.y1);
                }
                layoutData.rect = new Rect(bodyRect.x1, bodyRect.y1, bodyFullSize.width, this._callout.connector.view.lineWidth);
            }
            else {
                if (anchorCenter.y > bodyRect.y2) {
                    layoutData.transformOrigin = Direction.SouthWest;
                    layoutData.weldPoint = new Point(bodyRect.x1, bodyRect.y2);
                }
                else if (anchorCenter.y < bodyRect.y1) {
                    layoutData.transformOrigin = Direction.NorthWest;
                    layoutData.weldPoint = new Point(bodyRect.x1, bodyRect.y1);
                }
                else {
                    layoutData.transformOrigin = Direction.West;
                    layoutData.weldPoint = new Point(bodyRect.x1, anchorCenter.y);
                }
                layoutData.weldSide = Direction.West;
                layoutData.rect = new Rect(bodyRect.x1, bodyRect.y1, this._callout.connector.view.lineWidth, bodyFullSize.height);
            }
        }
        else {
            if (layoutData.angle < -1 * Math.PI / 4) {
                layoutData.transformOrigin = Direction.SouthEast;
                layoutData.weldSide = Direction.South;
                if (bodyRect.x2 < anchorCenter.x) {
                    layoutData.weldPoint = new Point(bodyRect.x2, bodyRect.y2);
                }
                else {
                    layoutData.weldPoint = new Point(anchorCenter.x, bodyRect.y2);
                }
                layoutData.rect = new Rect(bodyRect.x1, bodyRect.y2 - this._callout.connector.view.lineWidth, bodyFullSize.width, this._callout.connector.view.lineWidth);
            }
            else if (layoutData.angle > Math.PI / 4) {
                layoutData.transformOrigin = Direction.NorthEast;
                layoutData.weldSide = Direction.North;
                if (bodyRect.x2 < anchorCenter.x) {
                    layoutData.weldPoint = new Point(bodyRect.x2, bodyRect.y1);
                }
                else {
                    layoutData.weldPoint = new Point(anchorCenter.x, bodyRect.y1);
                }
                layoutData.rect = new Rect(bodyRect.x1, bodyRect.y1, bodyFullSize.width, this._callout.connector.view.lineWidth);
            }
            else {
                if (anchorCenter.y > bodyRect.y2) {
                    layoutData.transformOrigin = Direction.SouthEast;
                    layoutData.weldPoint = new Point(bodyRect.x2, bodyRect.y2);
                }
                else if (anchorCenter.y < bodyRect.y1) {
                    layoutData.transformOrigin = Direction.NorthEast;
                    layoutData.weldPoint = new Point(bodyRect.x2, bodyRect.y1);
                }
                else {
                    layoutData.transformOrigin = Direction.East;
                    layoutData.weldPoint = new Point(bodyRect.x2, anchorCenter.y);
                }
                layoutData.weldSide = Direction.East;
                layoutData.rect = new Rect(bodyRect.x2 - this._callout.connector.view.lineWidth, bodyRect.y1, this._callout.connector.view.lineWidth, bodyFullSize.height);
            }
        }
        this._layoutData = layoutData;
    };
    DefaultWeldingSeamView.prototype.updateLayout = function () {
        this._el.style.left = this._layoutData.rect.x1 + 'px';
        this._el.style.top = this._layoutData.rect.y1 + 'px';
        this._el.style.width = this._layoutData.rect.width + 'px';
        this._el.style.height = this._layoutData.rect.height + 'px';
        if (this._layoutData.weldSide != this._lastWeldSide) {
            if (this._lastWeldSide != null)
                removeClass(this._el, Direction[this._lastWeldSide].toLowerCase());
            addClass(this._el, Direction[this._layoutData.weldSide].toLowerCase());
            this._lastWeldSide = this._layoutData.weldSide;
        }
    };
    DefaultWeldingSeamView.prototype.animate = function (fadeIn) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var startTime = Date.now();
            var endTime = startTime + 400;
            var xOrigin = null;
            var yOrigin = null;
            if (_this._layoutData.weldSide == Direction.West) {
                yOrigin = _this.layoutData.transformOrigin == Direction.NorthWest ? 'top' : (_this.layoutData.transformOrigin == Direction.SouthWest ? 'bottom' : 'center');
            }
            else if (_this.layoutData.weldSide == Direction.North) {
                xOrigin = _this.layoutData.transformOrigin == Direction.NorthWest ? 'left' : (_this.layoutData.transformOrigin == Direction.NorthEast ? 'right' : 'center');
            }
            else if (_this.layoutData.weldSide == Direction.East) {
                yOrigin = _this.layoutData.transformOrigin == Direction.SouthEast ? 'bottom' : (_this.layoutData.transformOrigin == Direction.NorthEast ? 'top' : 'center');
            }
            else {
                xOrigin = _this.layoutData.transformOrigin == Direction.SouthEast ? 'right' : (_this.layoutData.transformOrigin == Direction.SouthWest ? 'left' : 'center');
            }
            if (xOrigin != null) {
                _this._el.style.transformOrigin = xOrigin + " top";
            }
            else {
                var v = "left " + yOrigin;
                //console.log(v);
                _this._el.style.transformOrigin = v;
            }
            console.log(Direction[_this._layoutData.weldSide]);
            var weldSide = _this._layoutData.weldSide;
            //console.log(Direction[weldSide]);
            var firstRun = true;
            var loop = function () {
                //console.log(Direction[weldSide]);
                var now = Date.now();
                if (firstRun) {
                    _this.show();
                    firstRun = false;
                }
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
                _this._el.style.transform = ((weldSide == Direction.East || weldSide == Direction.West) ? 'scaleY(' : 'scaleX(') + _this._scale + ')';
                console.log(_this._el.style.transform);
            };
            requestAnimationFrame(loop);
        });
    };
    DefaultWeldingSeamView.prototype.fadeIn = function () {
        return this.animate(true);
    };
    DefaultWeldingSeamView.prototype.fadeOut = function () {
        var _this = this;
        return this.animate(false).then(function () {
            _this.removeFromStage();
        });
    };
    return DefaultWeldingSeamView;
}(WeldingSeamView));
export var WeldLayoutData = (function () {
    function WeldLayoutData(angle, rect, weldSide, weldPoint, transformOrigin) {
        if (angle === void 0) { angle = 0; }
        if (rect === void 0) { rect = null; }
        if (weldSide === void 0) { weldSide = null; }
        if (weldPoint === void 0) { weldPoint = null; }
        if (transformOrigin === void 0) { transformOrigin = null; }
        this.angle = angle;
        this.rect = rect;
        this.weldSide = weldSide;
        this.weldPoint = weldPoint;
        this.transformOrigin = transformOrigin;
        if (rect == null)
            this.rect = new Rect();
        if (weldPoint == null)
            this.weldPoint = new Point();
    }
    return WeldLayoutData;
}());
//# sourceMappingURL=/Users/matthias/Development/Projects/archer-callouts/src/welding-seam-view.js.map