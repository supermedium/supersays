AFRAME.registerComponent('highscores', {
  schema: {
    spacing: {default: 1.0}
  },

  init: function(){
    this.scores = null;
    var db = firebase.database().ref('scores');
    db.orderByChild('score').limitToLast(10).on('value', this.updateScore.bind(this), this.updateError.bind(this));
    this.playerObjs = null;
    this.scoreObjs = null;
    this.pulsing = 0;
    this.startPulsingTime = null;
  },
  updateScore: function(data){
    var data = data.val()
    if (!data) return;
    this.scores = Object.values(data);
    if (this.scores.length < 10){
      for (var i = this.scores.length; i < 10; i++) {
        this.scores.push({name: 'noname', score: 0});
      }
    }
    this.scores.sort(function(a,b){ return a['score'] < b['score'] ? 1 : a['score'] > b['score'] ? -1 : 0})
    this.update();
    this.pulsing = 1;
    this.startPulsingTime = null;
    document.getElementById('highscoresSound').components.sound.playSound();
  }, 
  updateError: function(err){
    console.error(err);
  },
  goodScore: function(score){
    if (!this.scores) return true;
    for (var i = 0; i < this.scores.length; i++) {
      if (score > this.scores[i].score) return true;
    }
    return false;
  },
  saveScore: function(name, score){
    var db = firebase.database().ref('scores');
    db.push( {name: name.toLowerCase(), score: parseInt(score) });
  },
  update: function(oldData){
    var rows = this.el.children;
    var COLORS = ['#cf568c','#cd727d','#ca956b','#c3bb5c','#9dbb71','#72bc8b','#45bca4','#499eb8','#4d8dc2', '#517ecb'];
    this.playerObjs = [];
    this.scoreObjs = [];
    for (var i = 0; i < rows.length; i++) {
      var player = rows[i].querySelector('.player');
      var score = rows[i].querySelector('.score');
      var data = this.scores ? this.scores[i] : null;
      player.setAttribute('text', {value: data ? data.name.toLowerCase() : 'noname', color: COLORS[i]});
      score.setAttribute('text', {value: data ? data.score : 0, color: COLORS[i]});
      player.setAttribute('position', {y: - i * this.data.spacing});
      score.setAttribute('position', {y: - i * this.data.spacing});
      player.object3D.staticPos = player.object3D.position.clone();
      score.object3D.staticPos = score.object3D.position.clone();
      this.playerObjs.push(player.object3D);
      this.scoreObjs.push(score.object3D);
    }
  },
  tick: function(time, delta){
    if (this.pulsing <= 0) return;
    if (this.startPulsingTime === null) {this.startPulsingTime = time;}
    var t = time - this.startPulsingTime;
    var frec = 200 - 100 * this.pulsing;
    for (var i = 0; i < this.playerObjs.length; i++) {
      this.playerObjs[i].position.z = this.playerObjs[i].staticPos.z + Math.sin((t - i * 40) / frec ) * 0.3 * this.pulsing;
      this.scoreObjs[i].position.z = this.scoreObjs[i].staticPos.z + Math.sin((t - (i+2) * 40) / frec ) * 0.3 * this.pulsing;
    }
    this.pulsing -= delta / 6000.0;
  }
});

