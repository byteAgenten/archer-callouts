export var BodySection = (function () {
    function BodySection(_name) {
        this._name = _name;
        this._el = document.createElement('section');
        this._el.setAttribute('class', 'ac-body-section');
    }
    Object.defineProperty(BodySection.prototype, "el", {
        get: function () {
            return this._el;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BodySection.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BodySection.prototype, "content", {
        get: function () {
            return this._el.innerHTML;
        },
        set: function (value) {
            this._el.innerHTML = value;
        },
        enumerable: true,
        configurable: true
    });
    return BodySection;
}());
//# sourceMappingURL=/Users/matthias/Development/Projects/archer-callouts/src/body-section.js.map