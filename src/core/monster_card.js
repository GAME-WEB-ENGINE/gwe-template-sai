let fs = require('fs');
let { CARD_TYPE, MONSTER_CARD_RACE, LOCATION, CARD_POS } = require('./enums');
let { CardAbstract } = require('./card_abstract');

class MonsterCard extends CardAbstract {
  constructor(data) {
    super(data);

    if (!data['Type'] == CARD_TYPE.MONSTER) {
      return;
    }
    if (!data['Attributes'].hasOwnProperty('RACE')) {
      return;
    }
    if (!(
      data['Attributes']['RACE'] == MONSTER_CARD_RACE.AQUA ||
      data['Attributes']['RACE'] == MONSTER_CARD_RACE.BEAST ||
      data['Attributes']['RACE'] == MONSTER_CARD_RACE.BEAST_WARRIOR ||
      data['Attributes']['RACE'] == MONSTER_CARD_RACE.DINOSAUR ||
      data['Attributes']['RACE'] == MONSTER_CARD_RACE.FAIRY ||
      data['Attributes']['RACE'] == MONSTER_CARD_RACE.FIEND ||
      data['Attributes']['RACE'] == MONSTER_CARD_RACE.FISH ||
      data['Attributes']['RACE'] == MONSTER_CARD_RACE.INSECT ||
      data['Attributes']['RACE'] == MONSTER_CARD_RACE.MACHINE ||
      data['Attributes']['RACE'] == MONSTER_CARD_RACE.PLANT ||
      data['Attributes']['RACE'] == MONSTER_CARD_RACE.PSYCHIC ||
      data['Attributes']['RACE'] == MONSTER_CARD_RACE.PYRO ||
      data['Attributes']['RACE'] == MONSTER_CARD_RACE.REPTILE ||
      data['Attributes']['RACE'] == MONSTER_CARD_RACE.SEASERPENT ||
      data['Attributes']['RACE'] == MONSTER_CARD_RACE.SPELLCASTER ||
      data['Attributes']['RACE'] == MONSTER_CARD_RACE.THUNDER ||
      data['Attributes']['RACE'] == MONSTER_CARD_RACE.WARRIOR ||
      data['Attributes']['RACE'] == MONSTER_CARD_RACE.WINGEDBEAST ||
      data['Attributes']['RACE'] == MONSTER_CARD_RACE.ZOMBIE ||
      data['Attributes']['RACE'] == MONSTER_CARD_RACE.WYRM ||
      data['Attributes']['RACE'] == MONSTER_CARD_RACE.DRAGON ||
      data['Attributes']['RACE'] == MONSTER_CARD_RACE.DIVINEBEAST ||
      data['Attributes']['RACE'] == MONSTER_CARD_RACE.CREATORGOD ||
      data['Attributes']['RACE'] == MONSTER_CARD_RACE.CYBERSE)) {
      return;
    }
    if (!data['Attributes'].hasOwnProperty('ATK')) {
      return;
    }
    if (!data['Attributes'].hasOwnProperty('DEF')) {
      return;
    }
    if (!data['Attributes'].hasOwnProperty('ATK_COUNT')) {
      return;
    }
    if (!data['Attributes'].hasOwnProperty('ATK_COUNT_LIMIT')) {
      return;
    }
    if (!data['Attributes'].hasOwnProperty('STATE_FREEZE')) {
      return;
    }
  }

  static createFromFile(path) {
    let data = JSON.parse(fs.readFileSync(path));
    return new MonsterCard(data);
  }

  isSummonable() {
    if (this.location != LOCATION.HAND) {
      return false;
    }

    return true;
  }

  isCapableAttack() {
    if (this.location != LOCATION.MZONE) {
      return false;
    }
    if (this.position != CARD_POS.ATTACK) {
      return false;
    }
    if (this.attributes.get('ATK_COUNT') >= this.attributes.get('ATK_COUNT_LIMIT')) {
      return false;
    }

    return true;
  }

  isCapableChangePosition() {
    if (this.attributes.get('STATE_FREEZE') == 1) {
      return false;
    }

    return true;
  }
}

module.exports.MonsterCard = MonsterCard;