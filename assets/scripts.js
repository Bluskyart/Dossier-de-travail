export class Utils {
    constructor(selector) {
        this.elements = Utils.getSelector(selector);
        this.element = this.get(0);
        return this;
    }

    static getSelector(selector, context) {
        if (selector && typeof selector !== 'string') {
            if (selector.length !== undefined) {
                return selector;
            }
            return [selector];
        }
        context = context || document;

        // For performance reasons, use getElementById
        // eslint-disable-next-line no-control-regex
        const idRegex = /^#(?:[\w-]|\\.|[^\x00-\xa0])*$/;
        if (idRegex.test(selector)) {
            const el = document.getElementById(selector.substring(1));
            return el ? [el] : [];
        }
        return [].slice.call(context.querySelectorAll(selector) || []);
    }
    get(index) {
        if (index !== undefined) {
            return this.elements[index];
        }
        return this.elements;
    }
}

Utils.eventListeners = {};

export default function $utils(selector) {
    return new Utils(selector);
}
