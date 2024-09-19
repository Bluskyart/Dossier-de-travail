export class Utils {
    constructor(selector) {
        this.elements = Utils.getSelector(selector);
        this.element = this.get(0);
        return this;
    }

    each(func) {
        if (!this.elements.length) {
            return this;
        }
        this.elements.forEach((el, index) => {
            func.call(el, el, index);
        });
        return this;
    }
    children() {
        return new Utils(this.element.children);
    }
    data(name, value) {
        return this.attr('data-' + name, value);
    }
    on(events, listener) {
        events.split(' ').forEach((eventName) => {
            this.each((el) => {
                const tNEventName = Utils.setEventName(el, eventName);
                if (!Array.isArray(Utils.eventListeners[tNEventName])) {
                    Utils.eventListeners[tNEventName] = [];
                }
                Utils.eventListeners[tNEventName].push(listener);

                // https://github.com/microsoft/TypeScript/issues/28357
                if (el) {
                    el.addEventListener(eventName.split('.')[0], listener);
                }
            });
        });

        return this;
    }
    attr(name, value) {
        if (value === undefined) {
            if (!this.element) {
                return '';
            }
            return this.element.getAttribute(name);
        }
        this.each((el) => {
            el.setAttribute(name, value);
        });
        return this;
    }
    find(selector) {
        return new Utils(Utils.getSelector(selector, this.element));
    }
    hasClass(className) {
        if (!this.element) {
            return false;
        }
        return this.element.classList.contains(className);
    }
    removeClass(classNames) {
        this.each((el) => {
            // IE doesn't support multiple arguments
            classNames.split(' ').forEach((className) => {
                el.classList.remove(className);
            });
        });
        return this;
    }
    addClass(classNames = '') {
        this.each((el) => {
            // IE doesn't support multiple arguments
            classNames.split(' ').forEach((className) => {
                el.classList.add(className);
            });
        });
        return this;
    }
    hide() {
        this.each((el) => {
            el.style.display = 'none';
        });
    }
    show() {
        this.each((el) => {
            el.style.display = '';
        });
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
    static setEventName(el, eventName) {
        // Need to verify https://stackoverflow.com/questions/1915341/whats-wrong-with-adding-properties-to-dom-element-objects
        const elementUUId = el.eventEmitterUUID;
        const uuid = elementUUId || Utils.generateUUID();
        // eslint-disable-next-line no-param-reassign
        el.eventEmitterUUID = uuid;
        return Utils.getEventName(eventName, uuid);
    }
    static generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            // eslint-disable-next-line no-bitwise
            const r = (Math.random() * 16) | 0;
            // eslint-disable-next-line no-bitwise
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
    static getEventName(eventName, uuid) {
        return eventName + '__EVENT_EMITTER__' + uuid;
    }
}

Utils.eventListeners = {};

export default function $utils(selector) {
    return new Utils(selector);
}
