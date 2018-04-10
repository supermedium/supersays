AFRAME.registerComponent('simple-keyboard', {
  schema: {
    bgColor: {type: 'color', default: '#000'},
    hoverColor: {type: 'color', default: '#102445'},
    pressColor: {type: 'color', default: '#102445'},
    fontColor: {type: 'color', default: '#6699ff'},
    maxlength: {type: 'int', default: 0},
    model: {default: 'basic'},
    width: {default: 0.5},
    value: {type: 'string', default: ''},
    interval: {type: 'int', default: 50}
  },

  init: function(){
    this.KEYBOARDS = {
      'basic': {img: "./sk-basic.png", layout: [{"key":"1", "x":0.053, "y":0.089, "w":0.065, "h":0.167}, {"key":"2", "x":0.124, "y":0.089, "w":0.065, "h":0.167}, {"key":"3", "x":0.194, "y":0.089, "w":0.066, "h":0.167}, {"key":"4", "x":0.265, "y":0.089, "w":0.065, "h":0.167}, {"key":"5", "x":0.334, "y":0.089, "w":0.066, "h":0.167}, {"key":"6", "x":0.406, "y":0.089, "w":0.065, "h":0.167}, {"key":"7", "x":0.476, "y":0.089, "w":0.065, "h":0.167}, {"key":"8", "x":0.545, "y":0.089, "w":0.066, "h":0.167}, {"key":"9", "x":0.617, "y":0.089, "w":0.065, "h":0.167}, {"key":"0", "x":0.687, "y":0.089, "w":0.065, "h":0.167}, {"key":"Escape", "x":0.836, "y":0.101, "w":0.079, "h":0.158}, {"key":"Delete", "x":0.82, "y":0.507, "w":0.116, "h":0.132}, {"key":"Enter", "x":0.82, "y":0.726, "w":0.116, "h":0.164}, {"key":"q", "x":0.054, "y":0.308, "w":0.065, "h":0.167}, {"key":"w", "x":0.124, "y":0.308, "w":0.065, "h":0.167}, {"key":"e", "x":0.194, "y":0.308, "w":0.066, "h":0.167}, {"key":"r", "x":0.265, "y":0.308, "w":0.065, "h":0.167}, {"key":"t", "x":0.334, "y":0.308, "w":0.066, "h":0.167}, {"key":"y", "x":0.406, "y":0.308, "w":0.065, "h":0.167}, {"key":"u", "x":0.476, "y":0.308, "w":0.065, "h":0.167}, {"key":"i", "x":0.545, "y":0.308, "w":0.066, "h":0.167}, {"key":"o", "x":0.617, "y":0.308, "w":0.065, "h":0.167}, {"key":"p", "x":0.687, "y":0.308, "w":0.065, "h":0.167}, {"key":"a", "x":0.081, "y":0.519, "w":0.065, "h":0.167}, {"key":"s", "x":0.151, "y":0.519, "w":0.066, "h":0.167}, {"key":"d", "x":0.222, "y":0.519, "w":0.065, "h":0.167}, {"key":"f", "x":0.291, "y":0.519, "w":0.066, "h":0.167}, {"key":"g", "x":0.363, "y":0.519, "w":0.065, "h":0.167}, {"key":"h", "x":0.433, "y":0.519, "w":0.065, "h":0.167}, {"key":"j", "x":0.502, "y":0.519, "w":0.066, "h":0.167}, {"key":"k", "x":0.574, "y":0.519, "w":0.065, "h":0.167}, {"key":"l", "x":0.644, "y":0.519, "w":0.065, "h":0.167}, {"key":"z", "x":0.152, "y":0.728, "w":0.065, "h":0.167}, {"key":"x", "x":0.221, "y":0.728, "w":0.066, "h":0.167}, {"key":"c", "x":0.292, "y":0.728, "w":0.065, "h":0.167}, {"key":"v", "x":0.363, "y":0.728, "w":0.065, "h":0.167}, {"key":"b", "x":0.432, "y":0.728, "w":0.066, "h":0.167}, {"key":"n", "x":0.503, "y":0.728, "w":0.065, "h":0.167}, {"key":"m", "x":0.574, "y":0.728, "w":0.065, "h":0.167}] }
    };

    this.keys = null;
    this.focused = false;
    this.keyHover = null;
    this.prevCheckTime = null;

    this.kbImg = document.createElement('a-entity');
    this.el.appendChild(this.kbImg);
    this.kbImg.classList.add('keyboard-raycastable');
    this.kbImg.addEventListener('raycaster-intersected', this.hover.bind(this));
    this.kbImg.addEventListener('raycaster-intersected-cleared', this.blur.bind(this));

    this.textInput = document.createElement('a-entity');
    this.textInput.setAttribute('text', {align: 'center', value: this.data.value, color: this.data.fontColor, width: this.data.width, wrapCount:20});
    this.textInput.setAttribute('position', {x: 0, y: 0.176, z: -0.04});
    this.el.appendChild(this.textInput);

    document.addEventListener('keydown', this.keydown.bind(this));
    document.querySelector('[raycaster]').addEventListener('triggerdown', this.click.bind(this));
  },

  click: function(ev){
    if (!this.keyHover){ return; }
    this.data.value += this.keyHover.key;
    this.textInput.setAttribute('text', {value: this.data.value});
  },

  blur: function(ev){
    this.focused = false;
    if (this.keyHover) this.keyHover.el.setAttribute('material', {color: this.data.bgColor});
    this.keyHover = null;
  },

  hover: function(ev){
    this.focused = true;
  },

  keydown: function(ev){
    var keys = this.KEYBOARDS[this.data.model].layout;
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].key == ev.key){
        keys[i].el.setAttribute('material', {color: this.data.hoverColor});
        break;
      }
    }
  },
  
  update: function(oldData){
    var kbdata = this.KEYBOARDS[this.data.model];
    var w = this.data.width;
    var h = this.data.width / 2;
    var w2 = w / 2;
    var h2 = h / 2;
    
    this.kbImg.setAttribute('geometry', {primitive: 'plane', width: w, height: h});
    this.kbImg.setAttribute('material', {shader: 'flat', src: kbdata.img, color: this.data.fontColor, transparent: true});

    if (this.keys) {
      this.keys.parentNode.removeChild(this.keys);
    };

    this.keys = document.createElement('a-entity');
    this.el.appendChild(this.keys);
    this.keys.setAttribute('position', {x: 0, y: 0, z: 0.009});

    for (var i = 0; i < kbdata.layout.length; i++) {
      var kdata = kbdata.layout[i];
      var keyw = kdata.w * w;
      var keyh = kdata.h * h;
      var key = document.createElement('a-entity');
      key.setAttribute('data-key', kdata.key);
      key.setAttribute('position', {x: kdata.x * w - w2 + keyw / 2, y: (1 - kdata.y) * h - h2 - keyh / 2, z: 0})
      key.setAttribute('geometry', {primitive: 'plane', width: keyw, height: keyh});
      key.setAttribute('material', {shader: 'flat', color: this.data.bgColor});
      kdata.el = key;
      key.object3D.children[0].material.blending = THREE.AdditiveBlending;
      this.keys.appendChild(key);
    }
  },

  tick: function (time) {
    if (this.prevCheckTime && (time - this.prevCheckTime < this.data.interval)) { return; }
    this.prevCheckTime = time;
    if (this.focused){
      var uv = document.querySelector('[raycaster]').components.raycaster.getIntersection(this.kbImg).uv;
      var keys = this.KEYBOARDS[this.data.model].layout;
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (uv.x > k.x && uv.x < k.x + k.w && (1.0 - uv.y) > k.y && (1.0 - uv.y) < k.y + k.h) {
          if (this.keyHover) this.keyHover.el.setAttribute('material', {color: this.data.bgColor});
          k.el.setAttribute('material', {color: this.data.hoverColor});
          this.keyHover = k;
          break;
        }
      }
    }
  }
});