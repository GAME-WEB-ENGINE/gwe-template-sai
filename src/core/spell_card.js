let fs = require('fs');
let { CARD_TYPE, SPELL_CARD_MODE, SPELL_CARD_NATURE, LOCATION, CARD_POS } = require('./enums');
let { CARD_ACTIVATE_CONDITION_MAPPING } = require('./mappings/card_activate_condition_mapping');
let { CARD_TRIGGER_CONDITION_MAPPING } = require('./mappings/card_trigger_condition_mapping');
let { CARD_RELEASE_CONDITION_MAPPING } = require('./mappings/card_release_condition_mapping');
let { CardAbstract } = require('./card_abstract');
let { Effect } = require('./effect');

class SpellCard extends CardAbstract {
  constructor(data) {
    super(data);
    this.mode = '';
    this.nature = '';
    this.activateConditionId = '';
    this.activateConditionOpts = {};
    this.triggerConditionId = '';
    this.triggerConditionOpts = {};
    this.releaseConditionId = '';
    this.releaseConditionOpts = {};
    this.effects = [];

    if (!data['Type'] == CARD_TYPE.SPELL) {
      return;
    }
    if (!data.hasOwnProperty('Mode')) {
      return;
    }
    if (!(
      data['Mode'] == SPELL_CARD_MODE.ACTIVATE ||
      data['Mode'] == SPELL_CARD_MODE.TRIGGER)) {
      return;
    }
    if (!data.hasOwnProperty('Nature')) {
      return;
    }
    if (!(
      data['Nature'] == SPELL_CARD_NATURE.NORMAL ||
      data['Nature'] == SPELL_CARD_NATURE.CONTINUOUS)) {
      return;
    }

    this.mode = data['Mode'];
    this.nature = data['Nature'];

    if (data.hasOwnProperty('ActivateConditionId')) {
      this.activateConditionId = data['ActivateConditionId'];
      this.activateConditionOpts = data['ActivateConditionOpts'];
    }

    if (data.hasOwnProperty('TriggerConditionId')) {
      this.triggerConditionId = data['TriggerConditionId'];
      this.triggerConditionOpts = data['TriggerConditionOpts'];
    }

    if (data.hasOwnProperty('ReleaseConditionId')) {
      this.releaseConditionId = data['ReleaseConditionId'];
      this.releaseConditionOpts = data['ReleaseConditionOpts'];
    }

    for (let obj of data['Effects']) {
      this.effects.push(new Effect(obj, this));
    }
  }

  static createFromFile(path) {
    let data = JSON.parse(fs.readFileSync(path));
    return new SpellCard(data);
  }

  getMode() {
    return this.mode;
  }

  getNature() {
    return this.nature;
  }

  getEffects() {
    return this.effects;
  }

  isSetable() {
    if (this.location != LOCATION.HAND) {
      return false;
    }

    return true;
  }

  isActiveatable(duel) {
    if (this.mode != SPELL_CARD_MODE.ACTIVATE) {
      return false;
    }
    if (this.location != LOCATION.SZONE) {
      return false;
    }
    if (this.position != CARD_POS.FACEDOWN) {
      return false;
    }

    for (let effect of this.effects) {
      if (!effect.isPresentTarget(duel)) {
        return false;
      }
    }

    return this.isActivateConditionCheck(duel);
  }

  isTriggerable(duel, action) {
    if (this.mode != SPELL_CARD_MODE.TRIGGER) {
      return false;
    }
    if (this.location != LOCATION.SZONE) {
      return false;
    }
    if (this.position != CARD_POS.FACEDOWN) {
      return false;
    }

    for (let effect of this.effects) {
      if (!effect.isPresentTarget(duel)) {
        return false;
      }
    }

    return this.isTriggerConditionCheck(action);
  }

  isReleasable(duel) {
    if (this.nature != SPELL_CARD_NATURE.CONTINUOUS) {
      return false;
    }
    if (this.location != LOCATION.SZONE) {
      return false;
    }
    if (this.position != CARD_POS.FACEUP) {
      return false;
    }

    return this.isReleaseConditionCheck(duel);
  }

  isActivateConditionCheck(duel) {
    if (this.activateConditionId == '') {
      return true;
    }

    let activateConditionFn = CARD_ACTIVATE_CONDITION_MAPPING[this.activateConditionId];
    return activateConditionFn(duel, this, this.activateConditionOpts);
  }

  isTriggerConditionCheck(duel, action) {
    if (this.triggerConditionId == '') {
      return true;
    }

    let triggerConditionFn = CARD_TRIGGER_CONDITION_MAPPING[this.triggerConditionId];
    return triggerConditionFn(duel, this, action, this.triggerConditionOpts);
  }

  isReleaseConditionCheck(duel) {
    if (this.releaseConditionId == '') {
      return true;
    }

    let releaseConditionFn = CARD_RELEASE_CONDITION_MAPPING[this.releaseConditionId];
    return releaseConditionFn(duel, this, this.releaseConditionOpts);
  }
}

module.exports.SpellCard = SpellCard;