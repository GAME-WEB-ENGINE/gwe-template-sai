let { EFFECT_MECHANIC_MAPPING } = require('./mappings/effect_mechanic_mapping');
let { EFFECT_TARGET_CONDITION_MAPPING } = require('./mappings/effect_target_condition_mapping');

class Effect {
  constructor(data, card) {
    this.card = null;
    this.targetType = '';
    this.targetRange = '';
    this.targetConditionId = '';
    this.targetConditionOpts = {};
    this.mechanicId = '';
    this.mechanicOpts = {};
    this.targetCards = [];

    if (!data.hasOwnProperty('TargetType')) {
      return;
    }
    if (!(
      data['TargetType'] == EFFECT_TARGET_TYPE.SINGLE ||
      data['TargetType'] == EFFECT_TARGET_TYPE.FIELD ||
      data['TargetType'] == EFFECT_TARGET_TYPE.NONE)) {
      return;
    }
    if (!data.hasOwnProperty('TargetRange')) {
      return;
    }
    if (!data.hasOwnProperty('TargetConditionId')) {
      return;
    }
    if (!data.hasOwnProperty('TargetConditionOpts')) {
      return;
    }
    if (!data.hasOwnProperty('MechanicId')) {
      return;
    }
    if (!data.hasOwnProperty('MechanicOpts')) {
      return;
    }

    this.card = card;
    this.targetType = data['TargetType'];
    this.targetRange = data['TargetRange'];
    this.targetConditionId = data['TargetConditionId'];
    this.targetConditionOpts = data['TargetConditionOpts'];
    this.mechanicId = data['MechanicId'];
    this.mechanicOpts = data['MechanicOpts'];
  }

  isPresentTarget(duel) {
    let cardArray = duel.utilsQuery(this.card.controler, this.targetRange, card => card && this.isTargetConditionCheck(card));
    if (cardArray.length == 0) {
      return false;
    }

    return true;
  }

  isTarget(duel, card) {
    let cardArray = duel.utilsQuery(this.card.controler, this.targetRange, card => card && this.isTargetConditionCheck(card));
    if (cardArray.length == 0) {
      return false;
    }

    return cardArray.includes(card);
  }

  isTargetConditionCheck(card) {
    if (this.targetConditionId == '') {
      return true;
    }

    let targetFn = EFFECT_TARGET_CONDITION_MAPPING[this.targetConditionId];
    return targetFn(card, this.targetConditionOpts);
  }

  isPresentTargetCard(targetCard) {
    return this.targetCards.has(targetCard);
  }

  addTargetCard(targetCard) {
    this.targetCards.push(targetCard);
  }

  removeTargetCard(targetCard) {
    this.targetCards.remove(targetCard);
  }

  apply(duel, sourceCard, targetCard) {
    let mechanicFn = EFFECT_MECHANIC_MAPPING[this.mechanicId];
    mechanicFn(duel, sourceCard, this, targetCard, this.mechanicOpts);
  }
}

module.exports.Effect = Effect;