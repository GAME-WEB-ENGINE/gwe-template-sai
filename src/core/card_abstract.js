let { CARD_ELEMENT } = require('./enums');

class CardAbstract {
  constructor(data) {
    this.id = '';
    this.type = '';
    this.name = '';
    this.text = '';
    this.coverFile = '';
    this.attributes = null;
    this.owner = 0;
    this.controler = 0;
    this.position = '';
    this.location = LOCATION.DECK;
    this.turnCounter = 0;

    if (!data.hasOwnProperty('Type')) {
      return;
    }
    if (!data.hasOwnProperty('Name')) {
      return;
    }
    if (!data.hasOwnProperty('Text')) {
      return;
    }
    if (!data.hasOwnProperty('CoverFile')) {
      return;
    }
    if (!data.hasOwnProperty('Attributes')) {
      return;
    }
    if (!data['Attributes'].hasOwnProperty('ELEMENT')) {
      return;
    }
    if (!(
      data['Attributes']['ELEMENT'] == CARD_ELEMENT.DARK ||
      data['Attributes']['ELEMENT'] == CARD_ELEMENT.LIGHT ||
      data['Attributes']['ELEMENT'] == CARD_ELEMENT.EARTH ||
      data['Attributes']['ELEMENT'] == CARD_ELEMENT.WIND ||
      data['Attributes']['ELEMENT'] == CARD_ELEMENT.FIRE ||
      data['Attributes']['ELEMENT'] == CARD_ELEMENT.WATER ||
      data['Attributes']['ELEMENT'] == CARD_ELEMENT.DIVINE)) {
      return;
    }

    this.type = data['Type'];
    this.name = data['Name'];
    this.text = data['Text'];
    this.coverFile = data['CoverFile'];
    this.attributes = new Attributes(data['Attributes']);
  }

  getId() {
    return this.id;
  }

  getType() {
    return this.type;
  }

  getName() {
    return this.name;
  }

  getText() {
    return this.text;
  }

  getCoverFile() {
    return this.coverFile;
  }

  getAttribute(key) {
    return this.attributes.get(key);
  }

  getOwner() {
    return this.owner;
  }

  getControler() {
    return this.controler;
  }

  getPosition() {
    return this.position;
  }

  getLocation() {
    return this.location;
  }

  getTurnCounter() {
    return this.turnCounter;
  }

  setAttribute(key, value) {
    this.attributes.set(key, value);
  }

  incAttribute(key) {
    this.attributes.set(key, this.attributes.get(key) + 1);
  }

  isSummonable(duel) {
    return false;
  }

  isSetable(duel) {
    return false;
  }

  isCapableAttack(duel) {
    return false;
  }

  isCapableChangePosition(duel) {
    return false;
  }

  isActiveatable(duel) {
    return false;
  }

  isTriggerable(duel, action) {
    return false;
  }
}

module.exports.CardAbstract = CardAbstract;