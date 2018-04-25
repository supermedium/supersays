AFRAME.registerComponent('supersays', {
  schema: {
  },
  init: function(){
    this.tablePos = this.el.object3D.position;
    this.tableRadius = new THREE.Vector3(0.4, 0.4 * 0.05, 0.4);
    this.handRadius = 0.04;
    this.debug = document.getElementById('debug');
    this.leftOn = -1;
    this.rightOn = -1;
    this.leftHandEl = document.getElementById('lefthand');
    this.rightHandEl = document.getElementById('righthand');
    this.clock = document.getElementById('clock').object3D;
    this.levelText = document.getElementById('levelv');
    this.pointsText = document.getElementById('pointsv');
    this.messages = document.getElementById('messages');
    this.noteEls = [
      document.getElementById('note0'),
      document.getElementById('note1'),
      document.getElementById('note2'),
      document.getElementById('note3')
    ];
    this.leftHand = this.leftHandEl.object3D;
    this.rightHand = this.rightHandEl.object3D;
    this.leftPrevY = this.leftHand.position.y;
    this.rightPrevY = this.rightHand.position.y;
    this.a = new THREE.Vector3();
    this.b = new THREE.Vector3();
    this.el.addEventListener('savescore', this.saveScore.bind(this));
  },
  nextSong: function(){
    this.state = 1; // 0 paused, 1 supersays, 2 playersays
    this.time = 0;
    this.maxTime = 10000 - this.level * 200;
    this.response = [];
    this.pattern.push(Math.floor(Math.random() * 4));
    this.levelText.setAttribute('text', {value: '' + this.level});
    this.clock.visible = false;
    window.setTimeout(this.playSong.bind(this), 2000);
  },
  newGame: function(){
    this.messages.setAttribute('text', {value: ''});
    this.level = 1;
    this.pattern = [];
    this.points = 0;
    this.pointsAnim = 0;
    this.nextSong();
    this.pointsText.setAttribute('text', {value: 0});
  },
  play: function(){
    this.el.addEventListener('startgame', this.newGame.bind(this));
  },
  playSong: function(){
    this.note = 0;
    this.playSongNote();
  },
  playSongNote: function(){
    if (this.note == this.pattern.length){
      this.time = 0;
      this.state = 2;
      this.clock.position.x = 0;
      this.clock.scale.x = 1;
      this.clock.visible = true;
    }
    else{
      this.playNote(this.pattern[this.note], true);
      this.note++;
      window.setTimeout(this.playSongNote.bind(this), Math.floor(700 - this.level * 20));
    }
  },
  playerPlays: function(note){
    this.response.push(note);
    if (this.response.join('') === this.pattern.join('').substr(0, this.response.length)){
      if (this.response.length === this.pattern.length){
        this.points += Math.floor(this.level * 100 + (1.0 - this.time / this.maxTime) * 50);
        this.level++;
        this.nextSong();
      }
    }
    else { 
      this.gameOver(); 
    }
  },
  saveScore: function(ev){
    document.querySelector('[highscores]').components.highscores.saveScore(ev.detail.value, this.points);
  },
  gameOver: function(){
    this.state = 0;
    this.say("GAME OVER");
    document.getElementById('loopsound').components.sound.stopSound();
    if (document.querySelector('[highscores]').components.highscores.goodScore(this.points)){
      this.el.emit("askname");
    }
    else {
      this.el.emit("restart");
    }
    this.el.emit("gameover");
  },
  locateHit: function(v){
    if (v.x > 0 && v.z > 0) return 1;
    else if (v.x > 0 && v.z < 0) return 2;
    else if (v.x < 0 && v.z < 0) return 3;
    else return 0;
  },
  playNote: function(note, supersays){
    if (!supersays) {
      this.noteEls[note].emit('hitpos');
    }
    this.noteEls[note].emit('hit');
    this.noteEls[note].children[0].emit('hit');
    this.noteEls[note].children[1].emit('hit');
  },
  say: function(msg){
    this.messages.setAttribute('text', {value: msg});
    this.messages.emit('show');
  },
  tick: function(time, delta){
    if (this.points > this.pointsAnim){
      this.pointsAnim += 5;
      if (this.pointsAnim > this.points) this.pointsAnim = this.points;
      this.pointsText.setAttribute('text', {value: this.pointsAnim});
    }

    if (this.state != 2) return;
    var i;
    var left = this.leftHand.position;
    var right = this.rightHand.position;
    var leftv = left.y - this.leftPrevY;
    var rightv = right.y - this.rightPrevY;
    this.leftPrevY = left.y;
    this.rightPrevY = right.y;

    if (leftv < 0) {
      if (left.distanceTo(this.tablePos) < this.handRadius + this.tableRadius.x && left.y < this.tablePos.y + this.handRadius && left.y > this.tablePos.y - 0.3){
        this.a.set(left.x - this.tablePos.x, left.y - this.tablePos.y, left.z - this.tablePos.z);
        hit = this.locateHit(this.a);
        if (hit != this.leftOn){
          this.leftHandEl.components.haptics.pulse();
          this.leftHandEl.children[0].emit('hit');
          this.playerPlays(hit);
          this.playNote(hit, false);
          this.leftOn = hit;
        }
      }
      else{ this.leftOn = -1; }
    }
  
    if (rightv < 0) {
      if (right.distanceTo(this.tablePos) < this.handRadius + this.tableRadius.x && right.y < this.tablePos.y + this.handRadius && right.y > this.tablePos.y - 0.3){
        this.b.set(right.x - this.tablePos.x, right.y - this.tablePos.y, right.z - this.tablePos.z);
        hit = this.locateHit(this.b);
        if (hit != this.rightOn){
          this.rightHandEl.components.haptics.pulse();
          this.rightHandEl.children[0].emit('hit');
          this.playerPlays(hit);
          this.playNote(hit, false);
          this.rightOn = hit;
        }
      }
      else{ this.rightOn = -1; }
    }

    this.time += Math.min(20, delta);
    this.clock.scale.x = 1.0 - this.time / this.maxTime;
    this.clock.position.x = -0.4 * this.time / this.maxTime;
    if (this.time > this.maxTime){ 
      this.gameOver(); 
    }

  }


});