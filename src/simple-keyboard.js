AFRAME.registerComponent('simple-keyboard', {
  schema: {
    bgColor: {type: 'color', default: '#000'},
    hoverColor: {type: 'color', default: '#102445'},
    pressColor: {type: 'color', default: '#102445'},
    fontColor: {type: 'color', default: '#6699ff'},
    maxlength: {type: 'int', default: 0},
    model: {default: 'basic'},
    width: {default: 0.5}
  },
  init: function(){
    this.KEYBOARDS = {
      'basic': {img: "./sk-basic.png", layout: [{"key":"2", "x":0.159, "y":0.041, "w":0.085, "h":0.21}, {"key":"3", "x":0.247, "y":0.041, "w":0.079, "h":0.21}, {"key":"4", "x":0.328, "y":0.041, "w":0.078, "h":0.21}, {"key":"5", "x":0.408, "y":0.041, "w":0.081, "h":0.21}, {"key":"6", "x":0.492, "y":0.041, "w":0.08, "h":0.21}, {"key":"7", "x":0.575, "y":0.041, "w":0.081, "h":0.21}, {"key":"8", "x":0.658, "y":0.041, "w":0.083, "h":0.21}, {"key":"9", "x":0.745, "y":0.041, "w":0.079, "h":0.21}, {"key":"0", "x":0.826, "y":0.041, "w":0.094, "h":0.21}, {"key":"1", "x":0.067, "y":0.041, "w":0.088, "h":0.21}, {"key":"q", "x":0.001, "y":0.253, "w":0.093, "h":0.238}, {"key":"w", "x":0.096, "y":0.253, "w":0.119, "h":0.238}, {"key":"e", "x":0.216, "y":0.253, "w":0.09, "h":0.238}, {"key":"r", "x":0.309, "y":0.253, "w":0.096, "h":0.238}, {"key":"t", "x":0.407, "y":0.253, "w":0.092, "h":0.238}, {"key":"y", "x":0.501, "y":0.253, "w":0.091, "h":0.238}, {"key":"u", "x":0.595, "y":0.253, "w":0.108, "h":0.238}, {"key":"i", "x":0.705, "y":0.253, "w":0.087, "h":0.238}, {"key":"o", "x":0.794, "y":0.253, "w":0.101, "h":0.238}, {"key":"p", "x":0.897, "y":0.253, "w":0.095, "h":0.238}, {"key":"a", "x":0.054, "y":0.494, "w":0.099, "h":0.218}, {"key":" ", "x":0.156, "y":0.494, "w":0.089, "h":0.218}, {"key":"d", "x":0.247, "y":0.494, "w":0.1, "h":0.218}, {"key":"f", "x":0.349, "y":0.494, "w":0.09, "h":0.218}, {"key":"g", "x":0.442, "y":0.494, "w":0.102, "h":0.218}, {"key":"h", "x":0.546, "y":0.494, "w":0.104, "h":0.218}, {"key":"j", "x":0.653, "y":0.494, "w":0.091, "h":0.218}, {"key":"k", "x":0.747, "y":0.494, "w":0.098, "h":0.218}, {"key":"l", "x":0.847, "y":0.494, "w":0.092, "h":0.218}, {"key":"z", "x":0.121, "y":0.714, "w":0.112, "h":0.24}, {"key":"x", "x":0.235, "y":0.714, "w":0.098, "h":0.24}, {"key":"c", "x":0.334, "y":0.714, "w":0.099, "h":0.238}, {"key":"v", "x":0.435, "y":0.716, "w":0.099, "h":0.23}, {"key":"b", "x":0.537, "y":0.716, "w":0.095, "h":0.236}, {"key":"n", "x":0.634, "y":0.716, "w":0.097, "h":0.236}, {"key":"m", "x":0.735, "y":0.716, "w":0.112, "h":0.236}] }
    };
    this.kbImg = document.createElement('a-entity');
    this.el.appendChild(this.kbImg);
    this.el.className = 'keyboard-raycastable';
    this.keys = null;
    this.hovered = null;
    document.addEventListener('keydown', this.keydown.bind(this));
    document.addEventListener('raycaster-intersected', this.hover.bind(this));
  },

  hover: function(ev){
    var uv = ev.detail.intersection.uv;
    console.log(ev.detail.intersection);
    uv.y = 1.0 - uv.y;
    var keys = this.KEYBOARDS[this.data.model].layout;
    //console.log(ev.detail.intersection.faceIndex, uv.x, uv.y);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (uv.x > k.x && uv.x < k.x + k.w && uv.y > k.y && uv.y < k.y + k.h) {
        if (this.hovered) this.hovered.setAttribute('material', {color: this.data.bgColor});
        k.el.setAttribute('material', {color: this.data.hoverColor});
        this.hovered = k.el;
        break;
      }
    }
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
    this.kbImg.setAttribute('material', {shader: 'flat', src: kbdata.img, wireframe:true, transparent: false, color: this.data.fontColor, depthWrite: true});

    if (this.keys) {
      this.keys.parentNode.removeChild(this.keys);
    };

    this.keys = document.createElement('a-entity');
    this.el.appendChild(this.keys);
    this.keys.setAttribute('position', {x: 0, y: 0, z: -0.009});

    for (var i = 0; i < kbdata.layout.length; i++) {
      var kdata = kbdata.layout[i];
      var keyw = kdata.w * w;
      var keyh = kdata.h * h;
      var key = document.createElement('a-entity');
      key.setAttribute('data-key', kdata.key);
      key.setAttribute('position', {x: kdata.x * w - w2 + keyw / 2, y: (1 - kdata.y) * h - h2 - keyh / 2, z: 0})
      key.setAttribute('geometry', {primitive: 'plane', width: keyw, height: keyh});
      key.setAttribute('material', {shader: 'flat', color: this.data.bgColor, depthWrite: false});
      this.keys.appendChild(key);
      kdata.el = key;
    }

  }
});