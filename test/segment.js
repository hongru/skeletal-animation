var Segment = Laro.Sprite.extend(function (stage, fn) {
    this.joints = {};
}).methods({
    circle: function (x, y, radius, lineW) {
        if (lineW) this.ctx.lineWidth = lineW;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI*2, true);
        this.ctx.stroke();
        this.ctx.closePath();
    },
    setFixed: function (x, y) {
        
    },
    setJoint: function (name, x, y) {
        if (!this.joints) this.joints = {};
        this.joints[name] = {x: x, y: y};
    },
    getJoint: function (name) {
        return this.joints[name];
    },
    pos: function (x, y) {
        if (x == undefined && y == undefined) {
            return {x: this.x, y: this.y};
        }
        
        if (typeof x == 'object') {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x;
            this.y = y;
        }
    },
    getJointAbsPos: function (name) {
        if (this.joints[name]) {
            var j = this.joints[name];
            var angle = this.rotation * Math.PI / 180,
                disX = j.x - this.joints['fixed'].x,
                disY = j.y - this.joints['fixed'].y,
                xPos = this.x + Math.cos(angle) * disX - Math.sin(angle) * disY,
                yPos = this.y + Math.sin(angle) * disX + Math.cos(angle) * disY;
            return {x: xPos, y: yPos};
        }
    },

    setPosByJoint: function (seg, joint) {
        if (seg instanceof Segment && seg.joints[joint]) {
            this.x = seg.getJointAbsPos(joint).x - (this.joints['fixed'].x - seg.joints['fixed'].x);
            this.y = seg.getJointAbsPos(joint).y - (this.joints['fixed'].y - seg.joints['fixed'].y);
        }
    }
    
}).statics({
    DEBUG: true
});