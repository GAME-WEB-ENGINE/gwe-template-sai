class Turn {
  constructor() {
    this.phases = [];
    this.currentPhase = null;
  }

  getPhases() {
    return this.phases;
  }

  addPhase(phase) {
    this.phases.push(phase);
  }

  getCurrentPhase() {
    return this.currentPhase;
  }

  setCurrentPhase(currentPhase) {
    this.currentPhase = currentPhase;
  }
}

module.exports.Turn = Turn;