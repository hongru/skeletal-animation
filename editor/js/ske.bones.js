/* 处理bones */
;(function ($) {
    var els = {},
        texture_data = {},
        bone_data = {},
        ctx,
        stage;
        
    function getEls () {
        els.box = ske.byId('bone-box');
        els.canvas = ske.byId('bones-canvas');
        
        ctx = els.canvas.getContext('2d');
        stage = new Laro.Stage(els.canvas);
    }
    function bind () {
        
    }
    
    $.addBone = function (name, data) {
        texture_data[name] = data;
    }
    
    $.init = function () {
        getEls();
        bind();
    }

})(ske.bones);