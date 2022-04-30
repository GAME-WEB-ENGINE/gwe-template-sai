class Turn {
  constructor() {
    this.phases = [];
    this.currentPhase = null;
  }

  getPhases() {
    return this.phases;
  }

  getCurrentPhase() {
    return this.currentPhase;
  }

  setCurrentPhase(currentPhase) {
    this.currentPhase = currentPhase;
  }
}

module.exports.Turn = Turn;