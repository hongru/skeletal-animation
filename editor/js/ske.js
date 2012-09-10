var ske = {};
ske.texture = {};
ske.util = {};
ske.bones = {};

ske.extend = function (tar, sour, isOw) {
    if (isOw == undefined) isOw = true;
    for (var k in sour) {
        if (!(k in tar) || isOw) {
            tar[k] = sour[k];
        }
    }
    return tar;
};
ske.byId = function (id) {
    return document.getElementById(id);
};
ske.qs = function (sel) {
    return document.querySelector(sel);
};
ske.qsa = function (sel) {
    return document.querySelectorAll(sel);
};

ske.util.getActiveEl = function (fromEl, cmd, lev) {
    if (cmd == undefined) cmd = 'cmd';
    if (lev == undefined) lev = 3;
    
    if (fromEl && fromEl.getAttribute(cmd)) {
        return fromEl;
    }
    while(lev--) {
        fromEl = fromEl.parentNode;
        if (fromEl == document.documentElement) {
            return fromEl.getAttribute(cmd) ? fromEl : null;
        }
        if (fromEl.getAttribute(cmd)) {
            return fromEl;
        }
    }
    
    return null;
};