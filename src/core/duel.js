let fs = require('fs');
let { GWE } = require('gwe');
let { LOCATION, PHASE, HAND_MAX } = require('./enums');
let { HumanDuelist } = require('./duelist');
let { ActivateAction } = require('./duel_actions');
let { Turn } = require('./turn');
let { Phase } = require('./phase');

class Duel {
  constructor(data) {
    this.duelists = [];
    this.turns = [];
    this.currentTurn = null;
    this.currentDuelistIndex = -1;
    this.opponentDuelistIndex = -1;

    if (!data.hasOwnProperty('DuelistIds')) {
      return;
    }

    for (let i = 0; i < 2; i++) {
      let duelistId = data['DuelistIds'][i];
      let duelist = HumanDuelist.createFromFile('assets/models/' + duelistId + '/data.json');
      let deck = duelist.getDeck();

      for (let card of deck.getCards()) {
        card.setOwner(i);
        card.setControler(i);
        duelist.field.deck.push(card);
      }

      this.duelists.push(duelist);
    }
  }

  static createFromFile(path) {
    let data = JSON.parse(fs.readFileSync(path));
    return new Duel(data);
  }

  startup() {
    this.operationDraw(0, 4);
    this.operationDraw(1, 4);
    this.operationNewTurn();
  }

  async runAction(action) {
    let spellCards = this.utilsQuery(this.currentDuelistIndex, [[LOCATION.SZONE], [LOCATION.SZONE]], card => card);
    let cards = this.utilsQuery(this.currentDuelistIndex, [[LOCATION.MZONE, LOCATION.SZONE, LOCATION.FZONE], [LOCATION.MZONE, LOCATION.SZONE, LOCATION.FZONE]], card => card);

    // check triggers
    //
    for (let spellCard of spellCards) {
      if (spellCard.isTriggerable(this, action)) {
        await this.runAction(new ActivateAction(this, spellCard));
      }
    }

    // exec action
    //
    if (!action.isNegate()) {
      await action.exec();
    }
    else {
      return;
    }

    // check releases
    //
    for (let spellCard of spellCards) {
      if (spellCard.isReleasable(this)) {
        await this.operationDestroy(spellCard);
      }
    }

    // check & update target cards & status links
    //
    for (let spellCard of spellCards) {
      if (spellCard.getPosition() != CARD_POS.FACEUP) {
        continue;
      }
      if (spellCard.getNature() != SPELL_CARD_NATURE.CONTINUOUS) {
        continue;
      }

      for (let card of cards) {
        for (let effect of spellCard.getEffects()) {
          if (effect.getTargetType() != EFFECT_TARGET_TYPE.FIELD) {
            continue;
          }

          if (effect.isPresentTargetCard(card) && !effect.isTarget(this, card)) {
            effect.removeTargetCard(card);
            let attributes = card.getAttributes();
            attributes.removeModifierIf(m => m.isLinked() && m.getLinkedEffect() == effect);
          }
          else if (!effect.isPresentTargetCard(card) && effect.isTarget(this, card)) {
            effect.addTargetCard(card);
            effect.apply(this, spellCard, card);
          }
        }
      }

      for (let effect of spellCard.getEffects()) {
        if (effect.getTargetType() != EFFECT_TARGET_TYPE.SINGLE) {
          continue;
        }

        for (let targetCard of effect.getTargetCards()) {
          if (targetCard == null || !effect.isTargetConditionCheck(targetCard)) {
            await this.operationDestroy(spellCard);
          }
        }
      }
    }

    // check win/lost
    //
    if (this.duelists[0].getAttribute('LIFEPOINTS') == 0) {
      return 'WIN';
    }
    else if (this.duelists[1].getAttribute('LIFEPOINTS') == 0) {
      return 'LOST';
    }

    // check new turn
    //
    let currentPhase = this.currentTurn.getCurrentPhase();
    if (currentPhase.getId() == PHASE.END) {
      return this.operationNewTurn();
    }
  }

  getDuelists() {
    return this.duelists;
  }

  getCurrentDuelist() {
    return this.duelists[this.currentDuelistIndex];
  }

  getOpponentDuelist() {
    return this.duelists[this.opponentDuelistIndex];
  }

  getCurrentTurn() {
    return this.currentTurn;
  }

  getCurrentDuelistIndex() {
    return this.currentDuelistIndex;
  }

  getOpponentDuelistIndex() {
    return this.opponentDuelistIndex;
  }

  async operationNewTurn() {
    if (this.currentDuelistIndex == -1) {
      this.currentDuelistIndex = 1;
      this.opponentDuelistIndex = 0;
    }
    else if (this.currentDuelistIndex == 0) {
      this.currentDuelistIndex = 1;
      this.opponentDuelistIndex = 0;
    }
    else {
      this.currentDuelistIndex = 0;
      this.opponentDuelistIndex = 1;
    }

    if (this.turns.length < 2) {
      let turn = new Turn();
      turn.addPhase(CREATE_PHASE_DRAW());
      turn.addPhase(CREATE_PHASE_MAIN());
      turn.addPhase(CREATE_PHASE_END());
      turn.setCurrentPhase(turn.getPhases()[0]);
      this.turns.push(turn);
      this.currentTurn = turn;
    }
    else {
      let turn = new Turn();
      turn.addPhase(CREATE_PHASE_DRAW());
      turn.addPhase(CREATE_PHASE_MAIN());
      turn.addPhase(CREATE_PHASE_BATTLE());
      turn.addPhase(CREATE_PHASE_END());
      turn.setCurrentPhase(turn.getPhases()[0]);
      this.turns.push(turn);
      this.currentTurn = turn;
    }

    for (let duelist of this.duelists) {
      duelist.setAttribute('DRAW_COUNT', 0);
      duelist.setAttribute('SUMMON_COUNT', 0);
    }

    for (let card of this.utilsQuery(this.currentDuelistIndex, [[LOCATION.SZONE, LOCATION.MZONE, LOCATION.FZONE], [LOCATION.SZONE, LOCATION.MZONE, LOCATION.FZONE]], card => card)) {
      if (card.getType() == CARD_TYPE.MONSTER) {
        card.setAttribute('ATK_COUNT', 0);
        card.incTurnCounter();
      }
      else if (card.getType() == CARD_TYPE.SPELL && card.getPosition() == CARD_POS.FACEUP) {
        card.incTurnCounter();
      }
    }

    GWE.eventManager.emit(this, 'E_NEW_TURN');
  }

  async operationSelectLocation(range, predicateCard = () => true) {
    let response = {};
    response.state = false;
    response.location = '';
    response.index = 0;
    response.card = null;

    await GWE.eventManager.emit(this, 'E_SELECT_LOCATION', { range: range, predicateCard: predicateCard, response: response, required: false });
    if (!response.state) {
      return null;
    }

    return response;
  }

  async operationSelectRequiredLocation(range, predicateCard = () => true) {
    let response = {};
    response.state = false;
    response.location = '';
    response.index = 0;
    response.card = null;

    await GWE.eventManager.emit(this, 'E_SELECT_LOCATION', { range: range, predicateCard: predicateCard, response: response, required: true });
    if (!response.state) {
      return null;
    }

    return response;
  }

  // here

  async operationDraw(duelistIndex, numCards) {
    if (this.duelists[duelistIndex].field.hand.length + numCards > HAND_MAX) {
      for (let i = 0; i < this.duelists[duelistIndex].field.hand.length + numCards - HAND_MAX; i++) {
        let loc = await this.operationSelectLocation([[LOCATION.HAND], 0], card => card);
        this.duelists[duelistIndex].field.hand.remove(loc.card);
      }
    }

    while (numCards-- > 0) {
      let card = this.duelists[duelistIndex].field.deck.pop();
      this.duelists[duelistIndex].field.hand.push(card);
      card.location = LOCATION.HAND;
    }
  }

  async operationRestore(duelistIndex, amount) {
    this.duelists[duelistIndex].attributes.add('LIFEPOINTS', + amount);
    this.duelists[duelistIndex].emit('E_RESTORE', { amount: amount });
  }

  async operationDamage(duelistIndex, amount) {
    this.duelists[duelistIndex].attributes.add('LIFEPOINTS', - amount);
    this.duelists[duelistIndex].emit('E_DAMAGE', { amount: amount });
  }

  async operationSummon(monsterCard, index) {
    this.duelists[monsterCard.controler].field.hand.remove(monsterCard);
    this.duelists[monsterCard.controler].field.mzone[index] = monsterCard;
    monsterCard.position = CARD_POS.ATTACK;
    monsterCard.location = LOCATION.MZONE;
  }

  async operationSet(spellCard, index) {
    this.duelists[spellCard.controler].field.hand.remove(spellCard);
    this.duelists[spellCard.controler].field.szone[index] = spellCard;
    spellCard.position = CARD_POS.FACEDOWN;
    spellCard.location = LOCATION.SZONE;
  }

  async operationChangePosition(card, position) {
    card.position = position;
  }

  async operationBattle(attackerCard, targetCard) {
    let targetValue = targetCard.position == CARD_POS.ATTACK ? targetCard.getAttribute('ATK') : targetCard.getAttribute('DEF');
    let damage = attackerCard.getAttribute('ATK') - targetValue;

    if (damage > 0) {
      this.operationDestroy(targetCard);
      this.operationDamage(targetCard.controler, Math.abs(damage));
    }
    else if (damage < 0) {
      this.operationDestroy(attackerCard);
      this.operationDamage(attackerCard.controler, Math.abs(damage));
    }
  }

  async operationNextPhase() {
    let nextPhaseIndex = this.currentTurn.phases.indexOf(this.currentTurn.currentPhase) + 1;
    while (this.currentTurn.phases[nextPhaseIndex].disabled && nextPhaseIndex < this.currentTurn.phases.length) {
      nextPhaseIndex++;
    }

    this.currentTurn.currentPhase = this.currentTurn.phases[nextPhaseIndex];
  }

  async operationChangePhase(phaseId) {
    let phase = this.currentTurn.phases.find(phase => phase.id == phaseId);
    if (!phase) {
      throw new Error('Duel::operationChangePhase : phase not found !');
    }
    if (phase.disabled) {
      throw new Error('Duel::operationChangePhase : phase is disabled !');
    }

    this.currentTurn.currentPhase = phase;
  }

  async operationAddDuelistModifier(duelistIndex, modifier) {
    this.duelists[duelistIndex].attributes.addModifier(modifier);
  }

  async operationRemoveDuelistModifier(duelistIndex, modifierId) {
    this.duelists[duelistIndex].attributes.removeModifierIf(m => m.id == modifierId);
  }

  async operationAddCardModifier(card, modifier) {
    card.attributes.addModifier(modifier);
  }

  async operationRemoveCardModifier(card, modifierId) {
    card.attributes.removeModifierIf(m => m.id == modifierId);
  }

  async operationDestroy(card) {
    if (card.type == CARD_TYPE.SPELL) {
      for (let effect of card.effects) {
        for (let targetCard of effect.targetCards) {
          targetCard.attributes.removeModifierIf(m => m.linked && m.linkedEffect == effect);
        }

        for (let duelist of this.duelists) {
          duelist.attributes.removeModifierIf(m => m.linked && m.linkedEffect == effect);
        }
      }
    }

    this.utilsRemoveCard(card);
    this.duelists[card.controler].field.graveyard.push(card);
    card.position = CARD_POS.FACEDOWN;
    card.location = LOCATION.GRAVEYARD;
  }

  async operationActivateCardEffect(spellCard, effectIndex) {
    let targetCardArray = [];
    let effect = spellCard.effects[effectIndex];

    if (effect.targetType == EFFECT_TARGET_TYPE.SINGLE) {
      let loc = await this.operationSelectRequiredLocation(effect.targetRange, card => card && effect.isTarget(this, card));
      targetCardArray.push(loc.card);
    }
    else if (effect.targetType == EFFECT_TARGET_TYPE.FIELD) {
      targetCardArray = this.utilsQuery(spellCard.controler, effect.targetRange, card => card && effect.isTarget(this, card));
    }
    else if (effect.targetType == EFFECT_TARGET_TYPE.NONE) {
      targetCardArray = [null];
    }

    for (let targetCard of targetCardArray) {
      effect.apply(this, spellCard, targetCard);
      effect.addTargetCard(targetCard);
    }
  }

  utilsRemoveCard(card) {
    if (card.location == LOCATION.MZONE) {
      let index = this.duelists[card.controler].field.mzone.indexOf(card);
      this.duelists[card.controler].field.mzone[index] = null;
    }
    else if (card.location == LOCATION.SZONE) {
      let index = this.duelists[card.controler].field.szone.indexOf(card);
      this.duelists[card.controler].field.szone[index] = null;
    }
    else if (card.location == LOCATION.FZONE) {
      let index = this.duelists[card.controler].field.fzone.indexOf(card);
      this.duelists[card.controler].field.fzone[index] = null;
    }
    else if (card.location == LOCATION.DECK) {
      this.duelists[card.controler].field.deck.remove(card);
    }
    else if (card.location == LOCATION.GRAVEYARD) {
      this.duelists[card.controler].field.graveyard.remove(card);
    }
    else if (card.location == LOCATION.BANNISHED) {
      this.duelists[card.controler].field.bannished.remove(card);
    }
    else if (card.location == LOCATION.HAND) {
      this.duelists[card.controler].field.hand.remove(card);
    }
    else {
      throw new Error('Duel::removeCard: card not found');
    }
  }

  utilsQuery(duelistIndex, range, cardPredicate = (card) => true) {
    let cardArray = [];
    let currentDuelistIndex = duelistIndex;
    let opponentDuelistIndex = duelistIndex == 0 ? 1 : 0;

    for (let i = 0; i < 2; i++) {
      if (range[i] == 0) {
        continue;
      }

      let rangeDuelistIndex = i == 0 ? currentDuelistIndex : opponentDuelistIndex;

      if (range[i].includes(LOCATION.MZONE)) {
        cardArray = cardArray.concat(this.duelists[rangeDuelistIndex].field.mzone.filter(cardPredicate));
      }
      if (range[i].includes(LOCATION.SZONE)) {
        cardArray = cardArray.concat(this.duelists[rangeDuelistIndex].field.szone.filter(cardPredicate));
      }
      if (range[i].includes(LOCATION.FZONE)) {
        cardArray = cardArray.concat(this.duelists[rangeDuelistIndex].field.fzone.filter(cardPredicate));
      }
      if (range[i].includes(LOCATION.GRAVEYARD)) {
        cardArray = cardArray.concat(this.duelists[rangeDuelistIndex].field.graveyard.filter(cardPredicate));
      }
      if (range[i].includes(LOCATION.BANNISHED)) {
        cardArray = cardArray.concat(this.duelists[rangeDuelistIndex].field.bannished.filter(cardPredicate));
      }
      if (range[i].includes(LOCATION.DECK)) {
        cardArray = cardArray.concat(this.duelists[rangeDuelistIndex].field.deck.filter(cardPredicate));
      }
      if (range[i].includes(LOCATION.HAND)) {
        cardArray = cardArray.concat(this.duelists[rangeDuelistIndex].field.hand.filter(cardPredicate));
      }
    }

    return cardArray;
  }

  handleAI() {
    console.log('handle AI !');
  }
}

module.exports.Duel = Duel;

// -------------------------------------------------------------------------------------------
// HELPFUL
// -------------------------------------------------------------------------------------------

function CREATE_PHASE_DRAW() {
  return new Phase(PHASE.DRAW, 'Draw Phase', false);
}

function CREATE_PHASE_MAIN() {
  return new Phase(PHASE.MAIN, 'Main Phase', false);
}

function CREATE_PHASE_BATTLE() {
  return new Phase(PHASE.BATTLE, 'Battle Phase', false);
}

function CREATE_PHASE_END() {
  return new Phase(PHASE.END, 'End Phase', false);
}