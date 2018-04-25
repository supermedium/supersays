AFRAME.registerComponent('bgshapes', {
  schema:{
    count: {type: 'int', default: 40},
    radius: {default: 20},
    speed: {default: 1}
  },
  init: function(){
    this.shapes = [];
    this.planeGeometry = new THREE.PlaneBufferGeometry(5, 5);
    
    var img0 = new THREE.TextureLoader().load( document.getElementById('shape0Img').src );
    var img1 = new THREE.TextureLoader().load( document.getElementById('shape1Img').src );
    var img2 = new THREE.TextureLoader().load( document.getElementById('shape2Img').src );
    var img3 = new THREE.TextureLoader().load( document.getElementById('shape3Img').src );

    img0.anisotropy = 4;
    img1.anisotropy = 4;
    img2.anisotropy = 4;
    img3.anisotropy = 4;

    this.materials = [
      new THREE.MeshBasicMaterial( {side: THREE.DoubleSide, map: img0, transparent: true, depthWrite: false} ),
      new THREE.MeshBasicMaterial( {side: THREE.DoubleSide, map: img1, transparent: true, depthWrite: false} ),
      new THREE.MeshBasicMaterial( {side: THREE.DoubleSide, map: img2, transparent: true, depthWrite: false} ),
      new THREE.MeshBasicMaterial( {side: THREE.DoubleSide, map: img3, transparent: true, depthWrite: false} ),
    ];
  },
  repositionShape: function(shape){
    var v = new THREE.Vector3();
    v.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
    v.normalize().multiplyScalar(this.data.radius);
    shape.position.copy(v);
  },
  addShape: function(){
    var shape = new THREE.Mesh( 
      this.planeGeometry, 
      this.materials[Math.floor(Math.random() * this.materials.length
      )])

    var r = this.data.radius;
    var pi2 = 2 * Math.PI;
    this.repositionShape(shape)
    shape.rotation.set(Math.random() * pi2, Math.random() * pi2, Math.random() * pi2);
    shape.scale.set(0.3 + Math.random(), 0.3 + Math.random(), 0.3 + Math.random());
    shape.speed = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);

    this.el.object3D.add(shape);
    this.shapes.push(shape);
  },
  removeShape: function(){
    this.el.object3D.remove(this.shapes.pop());
  },
  update: function(oldData){
    var i = this.shapes.length;
    while(i != this.data.count) {
      i < this.data.count ? this.addShape() : this.removeShape();
      i = this.shapes.length;
    }
    if (this.data && this.data.radius != oldData.radius){
      for (i = 0; i < this.shapes.length; i++) {
        this.repositionShape(this.shapes[i]);
      }
    }
  },
  tick: function(time, delta){
    for (var i = 0; i < this.shapes.length; i++) {
      this.shapes[i].rotation.x += this.shapes[i].speed.x * delta / 3000.0 * this.data.speed;
      this.shapes[i].rotation.y += this.shapes[i].speed.y * delta / 3000.0 * this.data.speed;
      this.shapes[i].rotation.z += this.shapes[i].speed.z * delta / 3000.0 * this.data.speed;
    }
  }
})