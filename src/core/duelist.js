let fs = require('fs');
let { LOCATION } = require('./enums');
let { Deck } = require('./deck');
let { Attributes } = require('./attributes');
let { Zone } = require('./zone');

class DuelistAbstract {
  constructor(data) {
    this.name = '';
    this.pictureFile = '';
    this.deck = null;
    this.attributes = null;
    this.zones = [];

    if (!data.hasOwnProperty('Name')) {
      return;
    }
    if (!data.hasOwnProperty('PictureFile')) {
      return;
    }
    if (!data.hasOwnProperty('Deck')) {
      return;
    }
    if (!data.hasOwnProperty('Attributes')) {
      return;
    }
    if (!data['Attributes'].hasOwnProperty('LIFEPOINTS')) {
      return;
    }
    if (!data['Attributes'].hasOwnProperty('DRAW_COUNT')) {
      return;
    }
    if (!data['Attributes'].hasOwnProperty('DRAW_COUNT_LIMIT')) {
      return;
    }
    if (!data['Attributes'].hasOwnProperty('SUMMON_COUNT')) {
      return;
    }
    if (!data['Attributes'].hasOwnProperty('SUMMON_COUNT_LIMIT')) {
      return;
    }
    if (!data['Attributes'].hasOwnProperty('STATE_CANNOT_SET')) {
      return;
    }
    if (!data['Attributes'].hasOwnProperty('STATE_CANNOT_SUMMON')) {
      return;
    }

    this.name = data['Name'];
    this.pictureFile = data['PictureFile'];
    this.deck = new Deck(data['Deck']);
    this.attributes = new Attributes(data['Attributes']);

    let mzone = new Zone(LOCATION.MZONE);
    mzone.push(null, null, null);
    this.zones.push(mzone);

    let szone = new Zone(LOCATION.SZONE);
    szone.push(null, null, null);
    this.zones.push(szone);

    let fzone = new Zone(LOCATION.FZONE);
    fzone.push(null);
    this.zones.push(fzone);

    this.zones.push(new Zone(LOCATION.DECK));
    this.zones.push(new Zone(LOCATION.GRAVEYARD));
    this.zones.push(new Zone(LOCATION.BANNISHED));
    this.zones.push(new Zone(LOCATION.HAND));
  }

  getName() {
    return this.name;
  }

  getPictureFile() {
    return this.pictureFile;
  }

  getDeck() {
    return this.deck;
  }

  getAttributes() {
    return this.attributes;
  }

  getAttribute(key) {
    return this.attributes.get(key);
  }

  setAttribute(key, value) {
    this.attributes.set(key, value);
  }

  incAttribute(key) {
    this.attributes.set(key, this.attributes.get(key) + 1);
  }

  getZone(location) {
    return this.zones.find(z => z.getLocation() == location);
  }

  getCard(location, index) {
    let zone = this.zones.find(z => z.getLocation() == location);
    return zone[index];
  }

  insertCard(location, index, card) {
    let zone = this.zones.find(z => z.getLocation() == location);
    zone[index] = card;
  }

  removeCard(location, card) {
    let zone = this.zones.find(z => z.getLocation() == location);
    zone.splice(zone.indexOf(card), 1);
  }

  pushCard(location, card) {
    let zone = this.zones.find(z => z.getLocation() == location);
    zone.push(card);
  }

  popCard(location) {
    let zone = this.zones.find(z => z.getLocation() == location);
    return zone.pop();
  }

  getField() {
    return this.field;
  }

  isCapableDraw() {
    if (this.attributes.get('DRAW_COUNT') >= this.attributes.get('DRAW_COUNT_LIMIT')) {
      return false;
    }

    return true;
  }

  isCapableSummon() {
    if (this.attributes.get('STATE_CANNOT_SUMMON') == 1) {
      return false;
    }
    if (this.attributes.get('SUMMON_COUNT') >= this.attributes.get('SUMMON_COUNT_LIMIT')) {
      return false;
    }

    return true;
  }

  isCapableSet() {
    if (this.attributes.get('STATE_CANNOT_SET') == 1) {
      return false;
    }

    return true;
  }

  isCapableChangePosition() {
    return true;
  }

  isCapableActivate() {
    return true;
  }

  isCapableBattle() {
    return true;
  }
}

class HumanDuelist extends DuelistAbstract {
  constructor(data) {
    super(data);
  }

  static createFromFile(path) {
    let data = JSON.parse(fs.readFileSync(path));
    return new HumanDuelist(data);
  }
}

class AIDuelist extends DuelistAbstract {
  constructor(data) {
    super(data);
  }

  static createFromFile(path) {
    let data = JSON.parse(fs.readFileSync(path));
    return new AIDuelist(data);
  }
}

module.exports.HumanDuelist = HumanDuelist;
module.exports.AIDuelist = AIDuelist;