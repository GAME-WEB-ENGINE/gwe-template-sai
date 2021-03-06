let { GWE } = require('gwe');

class UITurn extends GWE.UIWidget {
  constructor() {
    super({
      className: 'UITurn'
    });

    this.duel = null;
  }

  update() {
    this.node.innerHTML = '';

    if (this.duel && this.duel.getCurrentTurn()) {
      let currentTurn = this.duel.getCurrentTurn();
      let currentPhase = currentTurn.getCurrentPhase();
      for (let phase of currentTurn.getPhases()) {
        this.node.innerHTML += `<div class="UITurn-phase ${currentPhase == phase ? 'u-active' : ''}">${phase.getName()}</div>`;
      }
    }
  }

  setDuel(duel) {
    this.duel = duel ? duel : null;
  }
}

module.exports.UITurn = UITurn;