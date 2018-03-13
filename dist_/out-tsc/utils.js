export function addClass(element, clazz) {
    element.setAttribute('class', element.getAttribute('class') + ' ' + clazz);
}
export function removeClass(element, clazz) {
    var classContent = element.getAttribute('class');
    var classIndex = classContent.indexOf(clazz);
    if (classIndex >= 0) {
        classContent = classContent.substring(0, classIndex) + ' ' + classContent.substring(classIndex + clazz.length, classContent.length);
        element.setAttribute('class', classContent);
    }
}
export function setClasses(element, classes) {
    var classContent = '';
    classes.forEach(function (clazz) {
        if (classContent.length > 0)
            classContent += ' ';
        classContent += clazz;
    });
    element.setAttribute('class', classContent);
}
export function relPos(container, el) {
    var containerBounds = container.getBoundingClientRect();
    var elBounds = el.getBoundingClientRect();
    return new Point(elBounds.left - containerBounds.left, elBounds.top - containerBounds.top);
}
export function relBounds(container, el) {
    var elBounds = el.getBoundingClientRect();
    var containerBounds = container.getBoundingClientRect();
    return {
        left: elBounds.left - containerBounds.left,
        top: elBounds.top - containerBounds.top,
        right: containerBounds.right - elBounds.right,
        bottom: containerBounds.bottom - elBounds.bottom,
        width: elBounds.width,
        height: elBounds.height
    };
}
export var Direction;
(function (Direction) {
    Direction[Direction["North"] = 0] = "North";
    Direction[Direction["NorthEast"] = 1] = "NorthEast";
    Direction[Direction["East"] = 2] = "East";
    Direction[Direction["SouthEast"] = 3] = "SouthEast";
    Direction[Direction["South"] = 4] = "South";
    Direction[Direction["SouthWest"] = 5] = "SouthWest";
    Direction[Direction["West"] = 6] = "West";
    Direction[Direction["NorthWest"] = 7] = "NorthWest";
})(Direction || (Direction = {}));
export var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.sub = function (p) {
        return new Point(this.x - p.x, this.y - p.y);
    };
    Point.prototype.add = function (p) {
        return new Point(this.x + p.x, this.y + p.y);
    };
    Point.prototype.multiply = function (factor) {
        return new Point(this.x * factor, this.y * factor);
    };
    return Point;
}());
export var Rect = (function () {
    function Rect(_x1, _y1, _width, _height) {
        this._x1 = _x1;
        this._y1 = _y1;
        this._width = _width;
        this._height = _height;
        this._x2 = this._x1 + this._width;
        this._y2 = this._y1 + this._height;
    }
    Object.defineProperty(Rect.prototype, "x1", {
        get: function () {
            return this._x1;
        },
        set: function (v) {
            this._x1 = v;
            this._x2 = this._x1 + this._width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "y1", {
        get: function () {
            return this._y1;
        },
        set: function (v) {
            this._y1 = v;
            this._y2 = this._y1 + this._height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "width", {
        get: function () {
            return this._width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "height", {
        get: function () {
            return this._height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "x2", {
        get: function () {
            return this._x2;
        },
        set: function (v) {
            this._x2 = v;
            this._x1 = this._x2 - this._width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "y2", {
        get: function () {
            return this._y2;
        },
        set: function (v) {
            this._y2 = v;
            this._y1 = this._y2 - this._height;
        },
        enumerable: true,
        configurable: true
    });
    Rect.prototype.shift = function (p) {
        return new Rect(this._x1 + p.x, this._y1 + p.y, this._width, this._height);
    };
    Rect.fromBounds = function (bounds) {
        return new Rect(bounds.left, bounds.top, bounds.width, bounds.height);
    };
    Rect.prototype.moveTo = function (p) {
        return new Rect(p.x, p.y, this._width, this._height);
    };
    return Rect;
}());
//# sourceMappingURL=/Users/matthias/Development/Projects/archer-callouts/src/utils.js.map