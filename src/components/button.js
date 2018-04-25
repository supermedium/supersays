AFRAME.registerComponent('button', {
  schema: {
    hitTarget: {type: 'selector', default: null},
    thickness: {default: 0.1},
    enabled: {default: true}
  },
  init: function () {
    this.hands = [document.getElementById('righthand'), document.getElementById('lefthand')];
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
    var hit = 0, hand;
    for (var i = 0; i < this.hands.length; i++) {
      if (this.bb.containsPoint(this.hands[i].object3D.position)){
        hit++;
        hand = this.hands[i];
      }
    }
    if (hit > 0){
      if (!this.hitting){
        this.emitEvent('focus');
        hand.components.haptics.pulse();
        this.hitting = true;
      }
    }
    else if (this.hitting){
      this.emitEvent('blur');
      this.hitting = false;
    }
  }
});