var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { BodySection } from "./body-section";
import { Direction, relBounds, relPos, Point, Rect } from "./utils";
export var BodyView = (function () {
    function BodyView(_callout) {
        var _this = this;
        this._callout = _callout;
        this._relativePosition = new Point(50, -50);
        this._sections = [];
        this._dragging = false;
        this.onMouseDown = function (evt) {
            console.log('mousedown');
            var anchorCenter = _this._callout.connector.anchor.view.center;
            var containerBounds = _this._callout.container.getBoundingClientRect();
            document.body.style.webkitUserSelect = 'none';
            _this._dragStartPos = new Point(evt.clientX - containerBounds.left, evt.clientY - containerBounds.top);
            _this._elDragStartPos = relPos(_this._callout.container, _this._bodyEl); // new Point(this._bodyEl.getBoundingClientRect().left, this._bodyEl.getBoundingClientRect().top);
            var onMouseMove = function (evt) {
                var dragDelta = new Point(evt.clientX, evt.clientY)
                    .sub(new Point(containerBounds.left, containerBounds.top))
                    .sub(_this._dragStartPos);
                var viewRect = Rect.fromBounds(_this.bounds);
                var newPos = _this._elDragStartPos.add(dragDelta);
                viewRect = viewRect.moveTo(newPos);
                _this.protectShelter(anchorCenter, viewRect);
                _this._bodyEl.style.left = viewRect.x1 + 'px';
                _this._bodyEl.style.top = viewRect.y1 + 'px';
                setTimeout(function () {
                    _this._relativePosition.x = _this.bounds.left - anchorCenter.x;
                    _this._relativePosition.y = _this.bounds.top - anchorCenter.y;
                    //console.log(this._relativePosition);
                });
                _this._callout.updatePosition(true);
            };
            var onMouseUp = function (evt) {
                document.body.removeEventListener('mousemove', onMouseMove);
                document.body.removeEventListener('mousup', onMouseUp);
                document.body.style.webkitUserSelect = null;
            };
            document.body.addEventListener('mousemove', onMouseMove);
            document.body.addEventListener('mouseup', onMouseUp);
        };
        this._bodyEl = document.createElement('div');
        this._bodyEl.setAttribute('class', 'ac-callout-body');
    }
    Object.defineProperty(BodyView.prototype, "bounds", {
        get: function () {
            return relBounds(this._callout.container, this._bodyEl);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BodyView.prototype, "weldingPoint", {
        get: function () { },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BodyView.prototype, "relativePosition", {
        get: function () {
            return this._relativePosition;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BodyView.prototype, "sections", {
        get: function () {
            return this._sections;
        },
        enumerable: true,
        configurable: true
    });
    BodyView.prototype.show = function () {
        this._callout.container.appendChild(this._bodyEl);
        this._bodyEl.addEventListener('mousedown', this.onMouseDown);
    };
    BodyView.prototype.calcAnchorDistance = function (rect) {
        var anchorCenter = this._callout.connector.anchor.view.center;
        switch (this._currentQuadrant) {
            case Direction.North: {
                return anchorCenter.y - rect.y2;
            }
            case Direction.East: {
                return rect.x1 - anchorCenter.x;
            }
            case Direction.South: {
                return rect.y1 - anchorCenter.y;
            }
            case Direction.West: {
                return anchorCenter.x - rect.x2;
            }
            case Direction.NorthEast: {
                var a = rect.x1 - anchorCenter.x;
                var b = anchorCenter.y - rect.y2;
                return Math.sqrt(a * a + b * b);
            }
            case Direction.SouthEast: {
                var a = rect.x1 - anchorCenter.x;
                var b = rect.y1 - anchorCenter.y;
                return Math.sqrt(a * a + b * b);
            }
            case Direction.SouthWest: {
                var a = anchorCenter.x - rect.x2;
                var b = rect.y1 - anchorCenter.y;
                return Math.sqrt(a * a + b * b);
            }
            case Direction.NorthWest: {
                var a = anchorCenter.x - rect.x2;
                var b = anchorCenter.y - rect.y2;
                return Math.sqrt(a * a + b * b);
            }
        }
        return 0;
    };
    BodyView.prototype.calcShelterOffset = function (p, rect) {
        var delta = new Point(Math.abs(rect.x1 - p.x), Math.abs(rect.y2 - p.y));
        var distance = Math.sqrt(delta.x * delta.x + delta.y * delta.y);
        var ratio = distance / this._callout.connector.anchor.shelterRadius;
        var offset = delta.multiply(1 / ratio);
        return offset;
    };
    BodyView.prototype.calcAngle = function (p, rect, direction) {
        switch (this._currentQuadrant) {
            case Direction.NorthEast: {
                var a = rect.x1 - p.x;
                var b = p.y - rect.y2;
                var c = Math.sqrt(a * a + b * b);
                var angle = Math.asin(b / c);
                return angle;
            }
        }
        return 0;
    };
    BodyView.prototype.updatePosition = function () {
        var anchorCenter = this._callout.connector.anchor.view.center;
        var viewPos = anchorCenter.add(this._relativePosition);
        var currentRect = Rect.fromBounds(this.bounds);
        var targetRect = currentRect.moveTo(viewPos);
        var containerBounds = this._callout.container.getBoundingClientRect();
        if (!(0 <= targetRect.x1 && targetRect.x2 < containerBounds.width)) {
            targetRect.x1 = currentRect.x1;
        }
        if (!(0 <= targetRect.y1 && targetRect.y2 < containerBounds.height)) {
            targetRect.y1 = currentRect.y1;
        }
        this.protectShelter(anchorCenter, targetRect);
        this._bodyEl.style.left = targetRect.x1 + 'px';
        this._bodyEl.style.top = targetRect.y1 + 'px';
    };
    BodyView.prototype.checkBorderCollision = function (rect) {
        var containerBounds = this._callout.container.getBoundingClientRect();
        return !(0 <= rect.x1 && rect.x2 < containerBounds.width && 0 <= rect.y1 && rect.y2 < containerBounds.height); // bounds.left < 0 || bounds.top < 0 || bounds.left + bounds.width > document.body.clientWidth || bounds.top + bounds.height > document.body.clientHeight; // bounds.right > document.body.clientWidth; // || bounds.top < 0 || bounds.y2 > document.body.clientHeight;
    };
    BodyView.prototype.hide = function () {
        this._bodyEl.removeEventListener('mousedown', this.onMouseDown);
        this._bodyEl.remove();
    };
    BodyView.prototype.protectShelter = function (anchorCenter, viewRect) {
        this._currentQuadrant = this.calcQuadrant(viewRect);
        var distance = this.calcAnchorDistance(viewRect);
        if (distance <= this._callout.connector.anchor.shelterRadius) {
            switch (this._currentQuadrant) {
                case Direction.North: {
                    viewRect.y2 = anchorCenter.y - this._callout.connector.anchor.shelterRadius;
                    break;
                }
                case Direction.South: {
                    viewRect.y1 = anchorCenter.y + this._callout.connector.anchor.shelterRadius;
                    break;
                }
                case Direction.East: {
                    viewRect.x1 = anchorCenter.x + this._callout.connector.anchor.shelterRadius;
                    break;
                }
                case Direction.West: {
                    viewRect.x2 = anchorCenter.x - this._callout.connector.anchor.shelterRadius;
                    break;
                }
                case Direction.NorthEast: {
                    var offset = this.calcShelterOffset(anchorCenter, viewRect);
                    viewRect.y1 = viewRect.y1 - offset.y;
                    viewRect.x1 = viewRect.x1 + offset.x;
                    break;
                }
                case Direction.SouthEast: {
                    var offset = this.calcShelterOffset(anchorCenter, viewRect);
                    viewRect.y1 = viewRect.y1 + offset.y;
                    viewRect.x1 = viewRect.x1 + offset.x;
                    break;
                }
                case Direction.SouthWest: {
                    var offset = this.calcShelterOffset(anchorCenter, viewRect);
                    viewRect.y1 = viewRect.y1 + offset.y;
                    viewRect.x1 = viewRect.x1 - offset.x;
                    break;
                }
                case Direction.NorthWest: {
                    var offset = this.calcShelterOffset(anchorCenter, viewRect);
                    viewRect.y1 = viewRect.y1 - offset.y;
                    viewRect.x1 = viewRect.x1 - offset.x;
                    break;
                }
            }
        }
    };
    return BodyView;
}());
export var DefaultBodyView = (function (_super) {
    __extends(DefaultBodyView, _super);
    function DefaultBodyView(callout) {
        _super.call(this, callout);
        this._bodyEl.setAttribute('class', this._bodyEl.getAttribute('class') + ' default');
        var headerSection = new BodySection('header');
        var contentSection = new BodySection('body');
        this._bodyEl.appendChild(headerSection.el);
        this._bodyEl.appendChild(contentSection.el);
        this._sections.push(headerSection);
        this._sections.push(contentSection);
    }
    Object.defineProperty(DefaultBodyView.prototype, "weldingPoint", {
        get: function () {
            var anchorCenter = this._callout.connector.anchor.view.center;
            var bodyBounds = this.bounds;
            var weldingPoint = new Point(0, 0);
            weldingPoint.x = bodyBounds.left;
            if (bodyBounds.top <= anchorCenter.y && anchorCenter.y < bodyBounds.top + bodyBounds.height) {
                weldingPoint.y = anchorCenter.y;
            }
            else {
                if (anchorCenter.y <= bodyBounds.top + bodyBounds.height) {
                    weldingPoint.y = bodyBounds.top;
                }
                else {
                    weldingPoint.y = bodyBounds.top + bodyBounds.height;
                }
            }
            if (bodyBounds.left <= anchorCenter.x && anchorCenter.x < bodyBounds.left + bodyBounds.width) {
                weldingPoint.x = anchorCenter.x;
            }
            else {
                if (anchorCenter.x <= bodyBounds.left) {
                    weldingPoint.x = bodyBounds.left;
                }
                else {
                    weldingPoint.x = bodyBounds.left + bodyBounds.width;
                }
            }
            return weldingPoint;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultBodyView.prototype, "centerPoint", {
        get: function () {
            var b = this.bounds;
            return new Point(b.left + b.width / 2, b.top + b.height / 2);
        },
        enumerable: true,
        configurable: true
    });
    DefaultBodyView.prototype.calcQuadrant = function (rect) {
        if (rect === void 0) { rect = null; }
        var anchorCenter = this._callout.connector.anchor.view.center;
        var bodyBounds = rect != null ? rect : Rect.fromBounds(this.bounds);
        var direction;
        if (bodyBounds.x1 <= anchorCenter.x && anchorCenter.x < bodyBounds.x2) {
            direction = bodyBounds.y1 + bodyBounds.height < anchorCenter.y ? Direction.North : Direction.South;
        }
        else if (bodyBounds.y1 <= anchorCenter.y && anchorCenter.y < bodyBounds.y2) {
            direction = anchorCenter.x < bodyBounds.x1 ? Direction.East : Direction.West;
        }
        else if (anchorCenter.x < bodyBounds.x1 && anchorCenter.y > bodyBounds.y2) {
            direction = Direction.NorthEast;
        }
        else if (anchorCenter.x < bodyBounds.x1 && anchorCenter.y < bodyBounds.y1) {
            direction = Direction.SouthEast;
        }
        else if (anchorCenter.x > bodyBounds.x2 && anchorCenter.y < bodyBounds.y1) {
            direction = Direction.SouthWest;
        }
        else {
            direction = Direction.NorthWest;
        }
        return direction;
    };
    return DefaultBodyView;
}(BodyView));
//# sourceMappingURL=/Users/matthias/Development/Projects/archer-callouts/src/body-view.js.map