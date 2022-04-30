let fs = require('fs');
let { Field } = require('./field');

class DuelistAbstract {
  constructor(data) {
    this.name = '';
    this.pictureFile = '';
    this.attributes = null;
    this.field = new Field();

    if (!data.hasOwnProperty('Name')) {
      return;
    }
    if (!data.hasOwnProperty('PictureFile')) {
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
    this.attributes = new Attributes(data['Attributes']);
  }

  getName() {
    return this.name;
  }

  getPictureFile() {
    return this.pictureFile;
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