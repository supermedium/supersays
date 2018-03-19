AFRAME.registerComponent('highscores', {
  schema: {
    spacing: {default: 1.0},
    scorePad: {default: 6}
  },
  init: function(){
  },
  pad: function(n, pad){
    n = n + '';
    return n.length >= pad ? n : new Array(pad - n.length + 1).join('0') + n;
  },
  update: function(oldData){
    var rows = this.el.children;
    var color = new THREE.Color(0xffff00);
    for (var i = 0; i < rows.length; i++) {
      var player = rows[i].querySelector('.player');
      var score = rows[i].querySelector('.score');
      player.setAttribute('text', {value: 'noname', color: color.getHex()});
      score.setAttribute('text', {value: this.pad(0, this.data.scorePad), color: color.getHex()});
      player.setAttribute('position', {y: - i * this.data.spacing});
      score.setAttribute('position', {y: - i * this.data.spacing});
      color.offsetHSL(0.08, 0, 0);
    }
  }
});