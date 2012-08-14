/* texture 处理 */

;(function ($) {
    var els = {};

    function getEls () {
        els.container = ske.byId('texture-container');
    }
    
    function onDragEnter (e) {
        e.preventDefault();
        els.container.classList.add('dragover');
    }
    function onDragOver (e) {
        e.preventDefault();
    }
    function onDragLeave (e) {
        e.preventDefault();
        els.container.classList.remove('dragover');
    }
    function onDrop (e) {
        e.preventDefault();
        
    }
    function bind () {
        els.container.addEventListener('dragenter', onDragEnter);
        els.container.addEventListener('dragover', onDragOver);
        els.container.addEventListener('dragleave', onDragLeave);
        els.container.addEventListener('drop', onDrop);
    }
    
    $.init = function () {
        getEls();
        bind();
    };
})(ske.texture);