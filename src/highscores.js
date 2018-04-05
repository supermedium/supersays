AFRAME.registerComponent('highscores', {
  schema: {
    spacing: {default: 1.0}
  },

  init: function(){
    this.scores = null;
    this.db = firebase.database().ref('scores').orderByValue().limitToFirst(10);
    this.db.on('value', this.updateScore.bind(this), this.updateError.bind(this));
  },
  updateScore: function(data){
    var data = data.val()
    this.scores = Object.values(data);
    this.scores.sort(function(a,b){ return a['score'] < b['score'] ? 1 : a['score'] > b['score'] ? -1 : 0})
    console.log(this.scores)
    this.update();
  }, 
  updateError: function(err){
    console.log(err);
  },
  saveScore: function(name, score){
    this.db.push( {name: name.substr(0, 3).toUpperCase(), score: parseInt(score) });
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

