AFRAME.registerComponent('button', {
  schema: {
    hitTarget: {type: 'selector', default: null},
    thickness: {default: 0.1},
    enabled: {default: true}
  },
  init: function () {
    this.hands = [document.getElementById('righthand').object3D, document.getElementById('lefthand').object3D];
    var target = this.data.hitTarget == null ? this.el: this.data.hitTarget;
    this.bb = new THREE.Box3().setFromObject(target.object3D);
    var coords = 'xyz'.split('');
    for(var i in coords){
      if (Math.abs(this.bb.min[coords[i]] - this.bb.max[coords[i]]) < 0.0001) {
        this.bb.min[coords[i]] -= this.data.thickness;
        this.bb.max[coords[i]] += this.data.thickness;
      }
    }
    this.hitting = [false, false];
  },
  emitEvent: function(event){
    this.el.emit(event);
    for (var i = 0; i < this.el.children.length; i++) {
      this.el.children[i].emit(event);
    }
  },
  tick: function(time, delta){
    if (!this.data.enabled) return;
    var hit = 0;
    for (var i = 0; i < this.hands.length; i++) {
      if (this.bb.containsPoint(this.hands[i].position)){ hit++; }
    }
    if (hit > 0){
      if (!this.hitting){
        this.emitEvent('focus');
        this.hitting = true;
      }
    }
    else if (this.hitting){
      this.emitEvent('blur');
      this.hitting = false;
    }
  }
});