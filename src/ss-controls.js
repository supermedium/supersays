AFRAME.registerComponent('ss-controls', {
  schema: {
    hand: {default: ''}
  },
  init: function(){
    this.table = document.getElementById('super');
    this.superpos = this.table.object3D.position;
    this.superradius = new THREE.Vector3(0.3, 0.3 * 0.36, 0.3);
    this.v = new THREE.Vector3();
    this.radius = parseFloat(this.el.children[0].getAttribute('radius'));
    this.debug = document.getElementById('debug');
    this.hitOn = -1;
    this.colors = ["#800", "#008", "#880", "#080"];
    this.hitcolors = ["#F00", "#00F", "#FF0", "#0F0"];
    for (var i = 0; i < 4; i++) {
      this.table.children[i].setAttribute('material', {color: this.colors[i], emissive: this.hitcolors[i], emissiveIntensity: 0});
    }
    this.hits = [0,0,0,0];
    this.updated = [true, true, true, true];
  },
  update: function (oldData) {
    var config = {
      hand: this.data.hand,
      model: false
    };
    this.el.setAttribute('vive-controls', config);
    this.el.setAttribute('oculus-touch-controls', config);
    this.el.setAttribute('windows-motion-controls', config);
  },
  tick: function(time, delta){
    var hand = this.el.object3D.position;
    var hit = -1;
    this.v.set(hand.x - this.superpos.x, hand.y - this.superpos.y, hand.z - this.superpos.z)
    if (hand.distanceTo(this.superpos) < this.radius + this.superradius.x &&
        this.v.y < this.superradius.y && 
        this.v.y > 0){
      if (this.v.x < 0 && this.v.z > 0) { hit = 0; }
      else if (this.v.x > 0 && this.v.z > 0) { hit = 1; }
      else if (this.v.x > 0 && this.v.z < 0) { hit = 2; }
      else if (this.v.x < 0 && this.v.z < 0) { hit = 3; }
      if (hit != this.hitOn){
        this.table.children[hit].children[0].emit('hit');
        //this.table.children[hit].setAttribute('material', {color: this.hitcolors[hit], emissiveIntensity: 1.0})
        this.hitOn = hit;
        this.hits[hit] ++;
        this.updated[hit] = false;
      }
    }
    else {
      /*
      for (var i = 0; i < 4; i++) {
        if (!this.updated[i] && this.hits[i] == 0) {
          this.table.children[i].children[0].emit('hit');//setAttribute('material', {color: this.colors[hit], emissiveIntensity: 0});
          this.updated[i] = true;
        }
      }
      */
    }
  }
});