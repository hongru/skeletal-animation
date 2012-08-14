var ske = {};
ske.texture = {};
ske.util = {};

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