AFRAME.registerComponent('supersays', {
  schema: {
  },
  init: function(){
    this.tablePos = this.el.object3D.position;
    this.tableRadius = new THREE.Vector3(0.4, 0.4 * 0.2, 0.4);
    this.handRadius = 0.06;
    this.debug = document.getElementById('debug');
    this.leftOn = -1;
    this.rightOn = -1;
    this.leftHandEl = document.getElementById('lefthand');
    this.rightHandEl = document.getElementById('righthand');
    this.clock = document.getElementById('clock').object3D;
    this.levelText = document.getElementById('levelv');
    this.pointsText = document.getElementById('pointsv');
    this.messages = document.getElementById('messages');
    this.leftHand = this.leftHandEl.object3D;
    this.rightHand = this.rightHandEl.object3D;
    this.leftPrevY = this.leftHand.position.y;
    this.rightPrevY = this.rightHand.position.y;
    this.a = new THREE.Vector3();
    this.b = new THREE.Vector3();
  },
  nextSong: function(){
    this.response = [];
    this.pattern.push(Math.floor(Math.random() * 4));
    this.levelText.setAttribute('text', {value: ''+this.level});
    this.clock.visible = false;
    window.setTimeout(this.playSong.bind(this), 2000);
  },
  newGame: function(){
    this.state = 1; // 0 paused, 1 supersays, 2 playersays
    this.level = 1;
    this.pattern = [];
    this.response = [];
    this.note = 0;
    this.time = 0;
    this.maxTime = 10000;
    this.nextSong();
  },
  play: function(){
    window.setTimeout(this.newGame.bind(this), 2000);
  },
  playSong: function(){
    this.note = 0;
    this.playSongNote();
  },
  playSongNote: function(){
    if (this.note == this.pattern.length){
      this.time = 0;
      this.state = 2;
      this.clock.position.x = -0.4;
      this.clock.scale.x = 0;
      this.clock.visible = true;
    }
    else{
      this.playNote(this.pattern[this.note], true);
      this.note++;
      window.setTimeout(this.playSongNote.bind(this), 700);
    }
  },
  playerPlays: function(note){
    this.response.push(note);
    if (this.response.join('') === this.pattern.join('').substr(0, this.response.length)){
      if (this.response.length === this.pattern.length){
        this.level++;
        this.nextSong();
      }
    }
    else { this.gameOver(); }
  },
  gameOver: function(){
    this.state = 0;
    this.say("GAME OVER");   
  },
  locateHit: function(v){
    if (v.x > 0 && v.z > 0) return 1;
    else if (v.x > 0 && v.z < 0) return 2;
    else if (v.x < 0 && v.z < 0) return 3;
    else return 0;
  },
  playNote: function(note, supersays){
    for (i = 0; i < this.el.children[note].children.length; i++) {
      if (!supersays && this.el.children[note].children[i].className == 'posanim') {
        this.el.children[note].children[i].emit('hitpos');
      }
      else { this.el.children[note].children[i].emit('hit'); }
    }
  },
  say: function(msg){
    this.messages.setAttribute('text', {value: msg});
    this.messages.emit('show');
  },
  tick: function(time, delta){
    if (this.state != 2) return;
    var i;
    var left = this.leftHand.position;
    var right = this.rightHand.position;
    var leftv = left.y - this.leftPrevY;
    var rightv = right.y - this.rightPrevY;
    this.leftPrevY = left.y;
    this.rightPrevY = right.y;

    if (leftv < 0) {
      this.a.set(left.x - this.tablePos.x, left.y - this.tablePos.y, left.z - this.tablePos.z);
      this.b.set(right.x - this.tablePos.x, right.y - this.tablePos.y, right.z - this.tablePos.z);

      if (left.distanceTo(this.tablePos) < this.handRadius + this.tableRadius.x && this.a.y < this.tableRadius.y && this.a.y > 0){
        hit = this.locateHit(this.a);
        if (hit != this.leftOn){
          this.leftHandEl.children[0].emit('hit');
          this.playerPlays(hit);
          this.playNote(hit, false);
          this.leftOn = hit;
        }
      }
      else{ this.leftOn = -1; }
    }

    if (rightv < 0) {
      if (right.distanceTo(this.tablePos) < this.handRadius + this.tableRadius.x && this.b.y < this.tableRadius.y && this.b.y > 0){
        hit = this.locateHit(this.b);
        if (hit != this.leftOn){
          this.rightHandEl.children[0].emit('hit');
          this.playerPlays(hit);
          this.playNote(hit, false);
          this.rightOn = hit;
        }
      }
      else{ this.rightOn = -1; }
    }

    this.time += delta;
    this.clock.scale.x = this.time / this.maxTime;
    this.clock.position.x = -0.4 * (1.0 - this.time / this.maxTime);
    if (this.time > this.maxTime){ this.gameOver(); }

  }


});