let fs = require('fs');
let { MonsterCard } = require('./monster_card');
let { SpellCard } = require('./spell_card');

class Deck {
  constructor(data) {
    this.cards = [];

    for (let obj of data) {
      if (obj['CardTypeName'] == 'MonsterCard') {
        let monsterCard = MonsterCard.createFromFile('assets/models/' + obj['CardId'] + '/data.json');
        this.cards.push(monsterCard);
      }
      else if (obj['CardTypeName'] == 'SpellCard') {
        let spellCard = SpellCard.createFromFile('assets/models/' + obj['CardId'] + '/data.json');
        this.cards.push(spellCard);
      }
    }
  }

  static createFromFile(path) {
    let data = JSON.parse(fs.readFileSync(path));
    return new Deck(data);
  }

  getCards() {
    return this.cards;
  }
}

module.exports.Deck = Deck;