/* texture 处理 */

;(function ($) {
    var els = {}, ctx, p_ctx, stage;

    function getEls () {
        els.container = ske.byId('texture-container');
        els.canvas = ske.byId('texture-canvas');
        els.imgName = ske.byId('imgName');
        els.previewCanvas = ske.byId('texturePreviewCanvas');
        els.box = ske.byId('texture-box');
        
        els.nameInput = ske.byId('nameInput');
        els.xInput = ske.byId('xInput');
        els.yInput = ske.byId('yInput');
        els.widthInput = ske.byId('widthInput');
        els.heightInput = ske.byId('heightInput');
        els.imgInput = ske.byId('imgInput');
        
        ctx = els.canvas.getContext('2d');
        p_ctx = els.previewCanvas.getContext('2d');
        stage = new Laro.Stage(els.canvas);
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
        var dt = e.dataTransfer;  
        var files = dt.files; 

        handleFiles(files); 
        els.container.classList.remove('dragover');
    }
    function handleFiles (files) {
        for (var i = 0; i < files.length; i++) { 
            var file = files[i];  
            var imageType = /image.*/;  
              
            if (!file.type.match(imageType)) {  
              continue;  
            }  

            var reader = new FileReader();  
            reader.onload = function(e){ 
                var imgurl = e.target.result;
                drawTexture(imgurl);
            }

            reader.readAsDataURL(file);  
            els.imgName.innerHTML = file.name;
        }  
    }
    function showEditBtns (bone) {
    
    }
    function onBoneMousedown(x, y) {
        $.MOUSEDOWN_BONE = this;
        this.selected = true;
        $.REL_BONE_POS = {x: x, y: y};
        
        showEditBtns(this);
        repaintStage();
    }
    function onStageMousedown (x, y) {
        if (/resize/.test(document.body.style.cursor)) {
            $.CUT_RESIZE = document.body.style.cursor;
            $.CUT_RESIZE_START_MOUSE = {x: x, y: y};
            $.CUT_RESIZE_START_DIM = {w:$.CUT_MASK.width, h:$.CUT_MASK.height};
        } else if (/move/.test(document.body.style.cursor)) {
            $.CUT_MOVE = true;
            $.CUT_MOVE_START_MOUSE = {x:x, y: y};
            $.CUT_MOVE_START_POS = {x:$.CUT_MASK.x, y:$.CUT_MASK.y};
        }
    }
    function onStageMousemove (x, y) {
        if ($.CUT_MASK && $.TEXTURE) {
            if (x > $.CUT_MASK.x && x < $.CUT_MASK.x + $.CUT_MASK.width) {
                if (Math.abs(y - $.CUT_MASK.y) <= 1) {
                    //document.body.style.cursor = 'n-resize';
                } else if (Math.abs(y - ($.CUT_MASK.y+$.CUT_MASK.height)) <= 1) {
                    document.body.style.cursor = 's-resize';
                } else if (y > $.CUT_MASK.y && y < $.CUT_MASK.y + $.CUT_MASK.height) {
                    document.body.style.cursor = 'move';
                } else {
                    document.body.style.cursor = 'default';
                }
            }
            
            if (y > $.CUT_MASK.y && y < $.CUT_MASK.y + $.CUT_MASK.height) {
                if (Math.abs(x - $.CUT_MASK.x) <= 1) {
                    //document.body.style.cursor = 'e-resize';
                } else if (Math.abs(x - ($.CUT_MASK.x+$.CUT_MASK.width)) <= 1) {
                    document.body.style.cursor = 'w-resize';
                } else if (x > $.CUT_MASK.x && x < $.CUT_MASK.x + $.CUT_MASK.width) {
                    document.body.style.cursor = 'move';
                } else {
                    document.body.style.cursor = 'default';
                }
            }
            
            //---
            if ($.CUT_RESIZE == 'w-resize') {
                var dis = x - $.CUT_RESIZE_START_MOUSE.x,
                    w = $.CUT_RESIZE_START_DIM.w + dis,
                    maxW = $.TEXTURE.x + $.TEXTURE.width - $.CUT_MASK.x;
                if (w < 3) { 
                    w = 3; 
                } else if (w > maxW) {
                    w = maxW;
                }
                $.CUT_MASK.width = w;
            } else if ($.CUT_RESIZE == 's-resize') {
                var dis = y - $.CUT_RESIZE_START_MOUSE.y,
                    h = $.CUT_RESIZE_START_DIM.h + dis,
                    maxH = $.TEXTURE.y + $.TEXTURE.height - $.CUT_MASK.y;
                if (h < 3) {
                    h = 3;
                } else if (h > maxH) {
                    h = maxH;
                }
                $.CUT_MASK.height = h;
            } else if ($.CUT_MOVE) {
                var disX = x - $.CUT_MOVE_START_MOUSE.x,
                    disY = y - $.CUT_MOVE_START_MOUSE.y,
                    maxX = $.TEXTURE.x + $.TEXTURE.width - $.CUT_MASK.width,
                    maxY = $.TEXTURE.y + $.TEXTURE.height - $.CUT_MASK.height;
                
                $.CUT_MASK.x = $.CUT_MOVE_START_POS.x + disX;
                $.CUT_MASK.y = $.CUT_MOVE_START_POS.y + disY;
                
                if ($.CUT_MASK.x < $.TEXTURE.x) { $.CUT_MASK.x = $.TEXTURE.x }
                if ($.CUT_MASK.y < $.TEXTURE.y) { $.CUT_MASK.y = $.TEXTURE.y }
                if ($.CUT_MASK.x > maxX) { $.CUT_MASK.x = maxX }
                if ($.CUT_MASK.y > maxY) { $.CUT_MASK.y = maxY }
            }
            
            repaintStage();
        }
    }
    function onStageMouseup (x, y) {
        $.MOUSEDOWN_BONE = null;
        $.REL_BONE_POS = null;
        $.CUT_RESIZE = null;
        $.CUT_MOVE = null;
        
        repaintStage();
    }
    function resizeCanvas (img) { 
        els.canvas.width = Math.max(img.width + 20, els.canvas.width);
        els.canvas.height = Math.max(img.height + 20, els.canvas.height);
        stage.width = els.canvas.width;
        stage.height = els.canvas.height;
    }
    function resizePreviewCanvas () {
        els.previewCanvas.height = $.CUT_MASK.height;
    }
    function createBone (img) {
        var bone = new Laro.Sprite(stage, function () {
            this.x = (els.canvas.width - img.width)/2;
            this.y = (els.canvas.height - img.height)/2;
            this.width = img.width;
            this.height = img.height;
            this.rotation = 0;
            this.selected = false;
            
            this.draw = function () {
                //this.selected && this.ctx.strokeRect(0, 0, this.width, this.height);
                this.ctx.fillStyle = '#fff';
                this.ctx.fillRect(0, 0, this.width, this.height);
                this.ctx.drawImage(img, 0, 0, this.width, this.height);
            }
        });
        bone.addEventListener('mousedown', Laro.curry(onBoneMousedown, bone));
        return bone;
    }
    function createCutMask (img) {
        var mask = new Laro.Sprite(stage, function () {
            this.x = (els.canvas.width - img.width)/2;
            this.y = (els.canvas.height - img.height)/2;
            this.width = img.width;
            this.height = img.height;
            this.rotation = 0;
            
            this.draw = function () {
                this.ctx.strokeStyle = 'red';
                this.ctx.strokeRect(0, 0, this.width, this.height);
            }
        });
        
        return mask;
    }
    function drawTexture (url) {
        var img = new Image();
        img.src = url;
        img.onload = function () {
            stage.children = [];
            resizeCanvas(img);
                                          			$.TEXTURE = createBone(img);
            $.CUT_MASK = createCutMask(img);
            
            repaintStage();
            els.imgName.style['display'] = 'block';
        }
        $.TEXTURE_IMG = img;
    }
    function updateInfo () {
        els.xInput.value = $.CUT_MASK.x - $.TEXTURE.x;
        els.yInput.value = $.CUT_MASK.y - $.TEXTURE.y;
        els.widthInput.value = $.CUT_MASK.width;
        els.heightInput.value = $.CUT_MASK.height;
        els.imgInput.value = els.imgName.innerHTML;
    }
    function drawPreview (img) {
        img = img || $.TEXTURE_IMG;
        resizePreviewCanvas();
        p_ctx.drawImage(img, $.CUT_MASK.x - $.TEXTURE.x, $.CUT_MASK.y - $.TEXTURE.y, $.CUT_MASK.width, $.CUT_MASK.height, 0, 0, $.CUT_MASK.width, $.CUT_MASK.height);
    }
    function repaintStage () {
        ctx.clearRect(0, 0, els.canvas.width, els.canvas.height);
        stage.draw = stage.children.length > 0 ? function () {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(0, 0, stage.width, stage.height);
        } : function () {};
        stage.dispatchDraw();
        
        drawPreview();
        updateInfo();
    }
    function dispatchClick (e) {
        var target = ske.util.getActiveEl(e.target);
        if (target) {
            var cmd = target.getAttribute('cmd');
            
            switch(cmd) {
                case 'addBone':
                    ske.bones.addBone()
                    break;
            }
        }
    }
    
    function bind () {
        els.container.addEventListener('dragenter', onDragEnter, false);
        els.container.addEventListener('dragover', onDragOver, false);
        els.container.addEventListener('dragleave', onDragLeave, false);
        els.container.addEventListener('drop', onDrop, false);
        els.box.addEventListener('click', dispatchClick, false);
        
        stage.addEventListener('mousedown', onStageMousedown);
        stage.addEventListener('mousemove', onStageMousemove);
        stage.addEventListener('mouseup', onStageMouseup);
    }
    
    $.init = function () {
        getEls();
        bind();
    };
})(ske.texture);