export function addClass(element, clazz) {
    var classContent = element.getAttribute('class');
    //console.log('ac: ' + classContent);
    if (classContent == null) {
        element.setAttribute('class', '');
        classContent = '';
    }
    if (classContent.length > 0)
        classContent += ' ';
    classContent = removeTokenFromString(classContent, clazz);
    classContent += clazz;
    element.setAttribute('class', classContent);
}
export function removeTokenFromString(text, token) {
    if (!text || text.length == 0)
        return text;
    var tokenIndex = text.search('\\b' + token + '\\b');
    //console.log('index: ' + tokenIndex);
    if (tokenIndex >= 0) {
        text = text.substring(0, tokenIndex) + ' ' + text.substring(tokenIndex + token.length, text.length);
        text = text.replace(/( ){2,}/g, ' '); //Remove potentially double blanks
    }
    return text;
}
export function removeClass(element, clazz) {
    //console.log('removeClass ' + clazz);
    var classContent = element.getAttribute('class');
    classContent = removeTokenFromString(classContent, clazz);
    element.setAttribute('class', classContent);
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
        right: elBounds.right + containerBounds.right,
        bottom: elBounds.bottom + containerBounds.bottom,
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
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
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
export var Dimension = (function () {
    function Dimension(width, height) {
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        this.width = width;
        this.height = height;
    }
    Dimension.prototype.clone = function () {
        return new Dimension(this.width, this.height);
    };
    return Dimension;
}());
export var Rect = (function () {
    function Rect(_x1, _y1, _width, _height) {
        if (_x1 === void 0) { _x1 = 0; }
        if (_y1 === void 0) { _y1 = 0; }
        if (_width === void 0) { _width = 0; }
        if (_height === void 0) { _height = 0; }
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
        set: function (v) {
            this._width = v;
            this._x2 = this._x1 + this._width;
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
    Object.defineProperty(Rect.prototype, "center", {
        get: function () {
            return new Point(this.x1 + this.width / 2, this.y1 + this.height / 2);
        },
        enumerable: true,
        configurable: true
    });
    Rect.prototype.shift = function (p) {
        return new Rect(this._x1 + p.x, this._y1 + p.y, this._width, this._height);
    };
    Object.defineProperty(Rect.prototype, "dimension", {
        get: function () {
            return new Dimension(this._width, this._height);
        },
        enumerable: true,
        configurable: true
    });
    Rect.fromBounds = function (bounds) {
        return new Rect(bounds.left, bounds.top, bounds.width, bounds.height);
    };
    Rect.prototype.moveTo = function (p) {
        return new Rect(p.x, p.y, this._width, this._height);
    };
    Rect.prototype.contains = function (rect, padding) {
        if (padding === void 0) { padding = 0; }
        return (rect.x1 - padding >= this.x1 && this.x2 > rect.x2 + padding) &&
            (rect.y1 - padding >= this.y1 && this.y2 > rect.y2 + padding);
    };
    return Rect;
}());
//# sourceMappingURL=/Users/matthias/Development/Projects/archer-callouts/src/utils.js.map