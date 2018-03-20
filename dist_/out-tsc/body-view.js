var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { BodySection } from "./body-section";
import { Direction, relBounds, relPos, Point, Rect, removeClass, addClass } from "./utils";
export var BodyView = (function () {
    function BodyView(_callout) {
        var _this = this;
        this._callout = _callout;
        this._relativePosition = new Point(50, -80);
        this._dragStartRelativePosition = new Point(0, 0);
        this._sections = [];
        this._layoutData = new BodyViewLayoutData();
        this._dragging = false;
        this.onMouseDown = function (evt) {
            var containerBounds = _this._callout.container.getBoundingClientRect();
            document.body.style.webkitUserSelect = 'none';
            _this._dragStartPos = new Point(evt.clientX - containerBounds.left, evt.clientY - containerBounds.top);
            _this._elDragStartPos = relPos(_this._callout.container, _this._bodyEl); // new Point(this._bodyEl.getBoundingClientRect().left, this._bodyEl.getBoundingClientRect().top);
            _this._dragStartRelativePosition = _this._relativePosition;
            var onMouseMove = function (evt) {
                _this.handlDragEvent(evt);
            };
            var onMouseUp = function (evt) {
                _this.handlDragEvent(evt);
                document.body.removeEventListener('mousemove', onMouseMove);
                document.body.removeEventListener('mouseup', onMouseUp);
                document.body.style.webkitUserSelect = null;
            };
            document.body.addEventListener('mousemove', onMouseMove);
            document.body.addEventListener('mouseup', onMouseUp);
        };
        this._currentWeldSide = Direction.North;
        this._bodyEl = document.createElement('div');
        this._bodyEl.setAttribute('class', 'ac-callout-body');
        this._sectionContainerEl = document.createElement('div');
        this._sectionContainerEl.setAttribute('class', 'ac-callout-body-sections');
        this._bodyEl.appendChild(this._sectionContainerEl);
    }
    Object.defineProperty(BodyView.prototype, "bounds", {
        get: function () {
            return relBounds(this._callout.container, this._bodyEl);
        },
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
        this._bodyEl.style.visibility = 'hidden';
        this._bodyEl.addEventListener('mousedown', this.onMouseDown);
    };
    BodyView.prototype.calcClosestPoint = function (rect) {
        var quadrant = this.calcQuadrant(rect);
        var anchorCenter = this._callout.connector.anchor.view.center;
        switch (quadrant) {
            case Direction.North: {
                return new Point(anchorCenter.x, rect.y2);
            }
            case Direction.East: {
                return new Point(rect.x1, anchorCenter.y);
            }
            case Direction.South: {
                return new Point(anchorCenter.x, rect.y1);
            }
            case Direction.West: {
                return new Point(rect.x2, anchorCenter.y);
            }
            case Direction.NorthEast: {
                return new Point(rect.x1, rect.y2);
            }
            case Direction.SouthEast: {
                return new Point(rect.x1, rect.y1);
            }
            case Direction.SouthWest: {
                return new Point(rect.x2, rect.y1);
            }
            case Direction.NorthWest: {
                return new Point(rect.x2, rect.y2);
            }
        }
    };
    BodyView.prototype.calcAnchorDistance = function (anchorCenter, rect, quadrant) {
        switch (quadrant) {
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
    BodyView.prototype.calculateLayout = function (currentRect) {
        if (currentRect === void 0) { currentRect = null; }
        var anchorCenter = this._callout.connector.anchor.view.center;
        console.log('Relpos');
        console.log(this._relativePosition);
        var viewPos = anchorCenter.add(this._relativePosition);
        if (currentRect == null)
            currentRect = Rect.fromBounds(this.bounds);
        var targetRect = currentRect.moveTo(viewPos);
        var containerBounds = this._callout.container.getBoundingClientRect();
        if (!(0 <= targetRect.x1 && targetRect.x2 < containerBounds.width)) {
            targetRect.x1 = currentRect.x1;
        }
        if (!(0 <= targetRect.y1 && targetRect.y2 < containerBounds.height)) {
            targetRect.y1 = currentRect.y1;
        }
        this._layoutData.quadrant = this.calcQuadrant(targetRect);
        this._layoutData.rect = this.protectShelter(anchorCenter, targetRect, this._layoutData.quadrant);
        this._layoutData.closestPoint = this.calcClosestPoint(targetRect);
    };
    BodyView.prototype.updateLayout = function () {
        this._bodyEl.style.left = this._layoutData.rect.x1 + 'px';
        this._bodyEl.style.top = this._layoutData.rect.y1 + 'px';
        this.setWeldClasses();
    };
    BodyView.prototype.checkBorderCollision = function (rect) {
        var containerBounds = this._callout.container.getBoundingClientRect();
        return !(0 <= rect.x1 && rect.x2 < containerBounds.width && 0 <= rect.y1 && rect.y2 < containerBounds.height); // bounds.left < 0 || bounds.top < 0 || bounds.left + bounds.width > document.body.clientWidth || bounds.top + bounds.height > document.body.clientHeight; // bounds.right > document.body.clientWidth; // || bounds.top < 0 || bounds.y2 > document.body.clientHeight;
    };
    BodyView.prototype.hide = function () {
        this._bodyEl.removeEventListener('mousedown', this.onMouseDown);
        this._bodyEl.remove();
    };
    BodyView.prototype.protectShelter = function (anchorCenter, viewRect, quadrant) {
        var distance = this.calcAnchorDistance(anchorCenter, viewRect, quadrant);
        if (distance <= this._callout.connector.anchor.shelterRadius) {
            switch (quadrant) {
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
        return viewRect;
    };
    Object.defineProperty(BodyView.prototype, "layoutData", {
        get: function () {
            return this._layoutData;
        },
        enumerable: true,
        configurable: true
    });
    BodyView.prototype.setWeldClasses = function () {
        var weldSide = this._callout.connector.weldingSeamView.weldSide;
        if (this._currentWeldSide != weldSide) {
            if (this._currentWeldSide != null)
                removeClass(this._bodyEl, 'weld-' + Direction[this._currentWeldSide].toLowerCase());
            this._currentWeldSide = weldSide;
            addClass(this._bodyEl, 'weld-' + Direction[this._currentWeldSide].toLowerCase());
        }
    };
    BodyView.prototype.handlDragEvent = function (evt) {
        var containerBounds = this._callout.container.getBoundingClientRect();
        var dragDelta = new Point(evt.clientX, evt.clientY)
            .sub(new Point(containerBounds.left, containerBounds.top))
            .sub(this._dragStartPos);
        this._relativePosition = this._dragStartRelativePosition.add(dragDelta);
        console.log(this._relativePosition);
        this.calculateLayout();
        this.updateLayout();
        this._callout.updatePosition(true);
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
        this._sectionContainerEl.appendChild(headerSection.el);
        this._sectionContainerEl.appendChild(contentSection.el);
        this._sections.push(headerSection);
        this._sections.push(contentSection);
    }
    DefaultBodyView.prototype.calcWeldingPoint = function (bodyRect) {
        if (bodyRect === void 0) { bodyRect = null; }
        var direction = this.calcQuadrant(bodyRect);
        var anchorCenter = this._callout.connector.anchor.view.center;
        var weldingPoint = new Point(anchorCenter.x, anchorCenter.y);
        switch (direction) {
            case Direction.North: {
                weldingPoint.y = bodyRect.y2;
                break;
            }
            case Direction.NorthEast: {
                weldingPoint.x = bodyRect.x1;
                weldingPoint.y = bodyRect.y2;
                break;
            }
            case Direction.East: {
                weldingPoint.x = bodyRect.x1;
                break;
            }
            case Direction.SouthEast: {
                weldingPoint.x = bodyRect.x1;
                weldingPoint.y = bodyRect.y1;
                break;
            }
            case Direction.South: {
                weldingPoint.y = bodyRect.y1;
                break;
            }
            case Direction.SouthWest: {
                weldingPoint.x = bodyRect.x2;
                weldingPoint.y = bodyRect.y1;
                break;
            }
            case Direction.West: {
                weldingPoint.x = bodyRect.x2;
                break;
            }
            case Direction.NorthWest: {
                weldingPoint.x = bodyRect.x2;
                weldingPoint.y = bodyRect.y2;
                break;
            }
        }
        return weldingPoint;
    };
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
        if (rect == null)
            rect = Rect.fromBounds(this.bounds);
        var direction;
        if (rect.x1 <= anchorCenter.x && anchorCenter.x < rect.x2) {
            direction = rect.y1 + rect.height < anchorCenter.y ? Direction.North : Direction.South;
        }
        else if (rect.y1 <= anchorCenter.y && anchorCenter.y < rect.y2) {
            direction = anchorCenter.x < rect.x1 ? Direction.East : Direction.West;
        }
        else if (anchorCenter.x < rect.x1 && anchorCenter.y > rect.y2) {
            direction = Direction.NorthEast;
        }
        else if (anchorCenter.x < rect.x1 && anchorCenter.y < rect.y1) {
            direction = Direction.SouthEast;
        }
        else if (anchorCenter.x > rect.x2 && anchorCenter.y < rect.y1) {
            direction = Direction.SouthWest;
        }
        else {
            direction = Direction.NorthWest;
        }
        return direction;
    };
    DefaultBodyView.prototype.fadeIn = function () {
        return this.animate(true);
    };
    DefaultBodyView.prototype.fadeOut = function () {
        var _this = this;
        return this.animate(false).then(function () {
            _this.hide();
        });
    };
    DefaultBodyView.prototype.animate = function (fadeIn) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var startTime = Date.now();
            var endTime = startTime + 200;
            var xOrigin = null;
            var yOrigin = null;
            var transformOrigin;
            var weldSide = _this._callout.connector.weldingSeamView.layoutData.weldSide;
            if (weldSide == Direction.West) {
                transformOrigin = "left";
            }
            else if (weldSide == Direction.North) {
                transformOrigin = "top";
            }
            else if (weldSide == Direction.East) {
                transformOrigin = "right";
            }
            else {
                transformOrigin = "bottom";
            }
            _this._sectionContainerEl.style.transformOrigin = transformOrigin;
            if (weldSide == Direction.East || weldSide == Direction.West) {
                _this._sectionContainerEl.style.transform = 'translateX(' + (fadeIn ? (weldSide == Direction.East ? 100 : -100) : 0) + '%)';
            }
            else {
                _this._sectionContainerEl.style.transform = 'translateY(' + (fadeIn ? (weldSide == Direction.South ? 100 : -100) : 0) + '%)';
            }
            if (fadeIn)
                _this._bodyEl.style.visibility = 'visible';
            var loop = function () {
                var now = Date.now();
                var scale = 0;
                if (now < endTime) {
                    var ratio = (now - startTime) / (endTime - startTime);
                    scale = fadeIn ? ratio : 1 - ratio;
                    requestAnimationFrame(loop);
                }
                else {
                    scale = fadeIn ? 1 : 0;
                    _this._bodyEl.style.transform = null;
                    resolve();
                }
                var translateValue = (weldSide == Direction.East || weldSide == Direction.South ? 1 : -1) * (100 - (scale * 100));
                _this._sectionContainerEl.style.transform = ((weldSide == Direction.East || weldSide == Direction.West) ? 'translateX(' : 'translateY(') + translateValue + '%)';
            };
            requestAnimationFrame(loop);
        });
    };
    return DefaultBodyView;
}(BodyView));
export var BodyViewLayoutData = (function () {
    function BodyViewLayoutData(rect, quadrant, closestPoint) {
        if (rect === void 0) { rect = null; }
        if (quadrant === void 0) { quadrant = null; }
        if (closestPoint === void 0) { closestPoint = null; }
        this.rect = rect;
        this.quadrant = quadrant;
        this.closestPoint = closestPoint;
        if (rect == null)
            this.rect = new Rect();
        if (closestPoint == null)
            this.closestPoint = new Point();
    }
    return BodyViewLayoutData;
}());
//# sourceMappingURL=/Users/matthias/Development/Projects/archer-callouts/src/body-view.js.map