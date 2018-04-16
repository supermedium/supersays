AFRAME.registerComponent('highscores', {
  schema: {
    spacing: {default: 1.0}
  },

  init: function(){
    this.scores = null;
    var db = firebase.database().ref('scores');
    db.orderByValue().limitToFirst(10).on('value', this.updateScore.bind(this), this.updateError.bind(this));
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
    db.push( {name: name.toUpperCase(), score: parseInt(score) });
  },
  update: function(oldData){
    var rows = this.el.children;
    var color = new THREE.Color(0xffff00);
    for (var i = 0; i < rows.length; i++) {
      var player = rows[i].querySelector('.player');
      var score = rows[i].querySelector('.score');
      var data = this.scores ? this.scores[i] : null;
      player.setAttribute('text', {value: data ? data.name : 'noname', color: color.getHex()});
      score.setAttribute('text', {value: data ? data.score : 0, color: color.getHex()});
      player.setAttribute('position', {y: - i * this.data.spacing});
      score.setAttribute('position', {y: - i * this.data.spacing});
      color.offsetHSL(0.08, 0, 0);
    }
  }
});

