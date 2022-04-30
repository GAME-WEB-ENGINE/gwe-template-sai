class Field {
  constructor(duel) {
    this.duel = duel;
    this.mzone = [];    
    this.szone = [];
    this.fzone = [];
    this.deck = [];
    this.graveyard = [];
    this.bannished = [];
    this.hand = [];

    this.mzone.push(null);
    this.mzone.push(null);
    this.mzone.push(null);
    this.szone.push(null);
    this.szone.push(null);
    this.szone.push(null);
    this.fzone.push(null);
  }
}

module.exports.Field = Field;