// author: @nuboctane
// version: 1.0
// license: None

class ClawOverlay {
    constructor(config = {}) {
        this.defaultKeys = config.keys || "QWERTYUIOPLKJHGFDSAZXCVBNM1234567890".split('');
        this.timeout = config.refreshTimeout || 500;
        this.toggleKeys = config.toggleKeys || ['G', 'H'];
        this.keyMap = new Map();
        this.visible = false;
        this.heldKeys = new Set();
        this.disabledListeners = [];

        this._injectStyle();
        this._setupEvents();
    }

    _injectStyle() {
        const style = document.createElement("style");
        style.textContent = `
            .claw-overlay {
                position: absolute !important;
                pointer-events: none !important;
                z-index: 999999999 !important;
                outline: 2px solid rgb(2, 20, 183) !important;
            }
            .claw-label {
                background: rgba(0, 20, 197, 0.562);
                font-family: Arial, sans-serif;
                font-size: 0.9em;
                color: cyan;
                padding: 1px 4px;
                pointer-events: none;
                position: absolute;
            }`;
        document.head.appendChild(style);
    }

    _setupEvents() {
        document.addEventListener("keydown", (e) => this._handleKeyDown(e), true);
        document.addEventListener("keyup", (e) => this._handleKeyUp(e), true);
        window.addEventListener("resize", () => this._refresh());
        window.addEventListener("scroll", () => this._debouncedRefresh(this.timeout / 2));
        window.addEventListener("wheel", () => this._debouncedRefresh(this.timeout / 2));
        document.addEventListener("click", () => this._debouncedRefresh(this.timeout));
    }

    _handleKeyDown(e) {
        const key = e.key.toUpperCase();
        this.heldKeys.add(key);

        if (this._isUserTyping()) return;

        if (this._toggleComboPressed(e)) {
            e.preventDefault();
            this.toggle();
            return;
        }

        if (!this.visible) return;

        const element = this.keyMap.get(key);
        if (element) {
            e.preventDefault();
            element.focus();
            element.click();
            if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) {
                setTimeout(() => this._refresh(), this.timeout);
            } else {
                this.hide();
            }
        }
    }

    _handleKeyUp() {
        this.heldKeys.clear();
    }

    _toggleComboPressed(e) {
        const combo = this.toggleKeys.map(k => k.toUpperCase());
        const keySet = new Set(this.heldKeys);

        if (combo.includes("SHIFT") && !e.shiftKey) return false;
        if (combo.includes("ALT") && !e.altKey) return false;
        if (combo.includes("CONTROL") && !e.ctrlKey) return false;
        if (combo.includes("META") && !e.metaKey) return false;

        const nonModifierKeys = combo.filter(k => !["SHIFT", "ALT", "CONTROL", "META"].includes(k));

        return nonModifierKeys.every(key => keySet.has(key));
    }

    _debouncedRefresh(delay) {
        clearTimeout(this.refreshTimer);
        this.refreshTimer = setTimeout(() => this._refresh(), delay);
    }

    toggle() {
        if (this._isUserTyping()) return;
        this.visible ? this.hide() : this.show();
    }

    show() {
        this._disableConflictingListeners();
        this._generateOverlays();
        this.visible = true;
    }

    hide() {
        this._removeOverlays();
        this.keyMap.clear();
        this.visible = false;

        for (const { type, intercept } of this.disabledListeners) {
            document.removeEventListener(type, intercept, true);
        }
        this.disabledListeners = [];
    }

    _refresh() {
        if (this.visible) {
            this.hide();
            this.show();
        }
    }

    _disableConflictingListeners() {
        const intercept = (e) => {
            if (this.visible) {
                e.preventDefault();
                e.stopImmediatePropagation();
                e.stopPropagation();
            }
        };

        ['keydown', 'keypress', 'keyup'].forEach(type => {
            document.addEventListener(type, intercept, true);
            this.disabledListeners.push({ type, intercept });
        });
    }


    _generateOverlays() {
        const interactiveTags = 'button, input:not([type="hidden"]), textarea, select, a[href]';
        const elements = Array.from(document.querySelectorAll(interactiveTags)).filter(el => this._isVisible(el));

        let usedKeys = new Set();

        for (let i = 0; i < elements.length && i < this.defaultKeys.length; i++) {
            const el = elements[i];
            const key = this.defaultKeys[i];
            usedKeys.add(key);

            this.keyMap.set(key, el);

            const rect = el.getBoundingClientRect();
            const label = document.createElement("div");
            label.className = "claw-overlay";
            label.style.left = `${rect.left + window.scrollX}px`;
            label.style.top = `${rect.top + window.scrollY}px`;
            label.style.width = `${rect.width}px`;
            label.style.height = `${rect.height}px`;

            const text = document.createElement("div");
            text.className = "claw-label";
            text.textContent = key;
            text.style.top = "2px";
            text.style.left = "2px";

            label.appendChild(text);
            document.body.appendChild(label);
        }
    }

    _removeOverlays() {
        const overlays = document.querySelectorAll(".claw-overlay");
        overlays.forEach(o => o.remove());
    }

    _isVisible(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.width > 0 &&
            rect.height > 0 &&
            rect.bottom >= 0 &&
            rect.right >= 0 &&
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.left <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    _isUserTyping() {
        const active = document.activeElement;
        return (
            active &&
            (
                active.tagName === 'INPUT' ||
                active.tagName === 'TEXTAREA' ||
                active.isContentEditable ||
                active.getAttribute('role') === 'textbox'
            ) &&
            !active.readOnly &&
            !active.disabled
        );
    }
}

// Initialize
const claw = new ClawOverlay({
    keys: "QWERTYUIOPASDFGHJKLZXCVBNM".split(''), // available keys to use when rendering boxes
    refreshTimeout: 500,
    toggleKeys: ['SHIFT', 'ALT'] // press SHIFT + ALT to toggle
});
