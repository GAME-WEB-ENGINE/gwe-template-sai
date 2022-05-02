const { GWE } = require("gwe");
let { LOCATION } = require('../core/enums');
let { UICardSlot } = require('./ui_card_slot');
let { UIStackSlot } = require('./ui_stack_slot');

const SLOT_SPELL_00 = 0;
const SLOT_SPELL_01 = 1;
const SLOT_SPELL_02 = 2;
const SLOT_MONSTER_00 = 3;
const SLOT_MONSTER_01 = 4;
const SLOT_MONSTER_02 = 5;
const SLOT_HAND_00 = 6;
const SLOT_HAND_01 = 7;
const SLOT_HAND_02 = 8;
const SLOT_HAND_03 = 9;
const SLOT_HAND_04 = 10;
const SLOT_HAND_05 = 11;
const SLOT_FIELD_00 = 12;
const SLOT_GRAVEYARD_00 = 13;
const SLOT_DECK_00 = 14;
const SLOT_SPELL_10 = 15;
const SLOT_SPELL_11 = 16;
const SLOT_SPELL_12 = 17;
const SLOT_MONSTER_10 = 18;
const SLOT_MONSTER_11 = 19;
const SLOT_MONSTER_12 = 20;
const SLOT_HAND_10 = 21;
const SLOT_HAND_11 = 22;
const SLOT_HAND_12 = 23;
const SLOT_HAND_13 = 24;
const SLOT_HAND_14 = 25;
const SLOT_HAND_15 = 26;
const SLOT_FIELD_10 = 27;
const SLOT_GRAVEYARD_10 = 28;
const SLOT_DECK_10 = 29;
const SLOT_LENGTH = 30;

class UIBoard extends GWE.UIWidget {
  constructor() {
    super({
      className: 'UIBoard',
      template: `
      <div class="UIBoard-fields">
        <div class="UIBoard-field" data-duelist-index="0">
          <div class="UIBoard-field-zone js-zone" data-duelist-index="0" data-location="MZONE" style="top:80px; left:327px;"></div>
          <div class="UIBoard-field-zone js-zone" data-duelist-index="0" data-location="MZONE" style="top:80px; left:377px;"></div>
          <div class="UIBoard-field-zone js-zone" data-duelist-index="0" data-location="MZONE" style="top:80px; left:427px;"></div>
          <div class="UIBoard-field-zone js-zone" data-duelist-index="0" data-location="SZONE" style="top:10px; left:327px;"></div>
          <div class="UIBoard-field-zone js-zone" data-duelist-index="0" data-location="SZONE" style="top:10px; left:377px;"></div>
          <div class="UIBoard-field-zone js-zone" data-duelist-index="0" data-location="SZONE" style="top:10px; left:427px;"></div>
          <div class="UIBoard-field-zone js-zone" data-duelist-index="0" data-location="FZONE" style="top:150px; left:10px;"></div>
          <div class="UIBoard-field-zone js-zone" data-duelist-index="0" data-location="GRAVEYARD" style="top:80px; left:10px;"></div>
          <div class="UIBoard-field-zone js-zone" data-duelist-index="0" data-location="DECK" style="top:10px; left:10px;"></div>
          <div class="UIBoard-field-zone js-zone" data-duelist-index="0" data-location="HAND" style="top:10px; right:10px;"></div>
        </div>
        <div class="UIBoard-field" data-duelist-index="1">
          <div class="UIBoard-field-zone js-zone" data-duelist-index="1" data-location="MZONE" style="bottom:80px; right:327px;"></div>
          <div class="UIBoard-field-zone js-zone" data-duelist-index="1" data-location="MZONE" style="bottom:80px; right:377px;"></div>
          <div class="UIBoard-field-zone js-zone" data-duelist-index="1" data-location="MZONE" style="bottom:80px; right:427px;"></div>
          <div class="UIBoard-field-zone js-zone" data-duelist-index="1" data-location="SZONE" style="bottom:10px; right:327px;"></div>
          <div class="UIBoard-field-zone js-zone" data-duelist-index="1" data-location="SZONE" style="bottom:10px; right:377px;"></div>
          <div class="UIBoard-field-zone js-zone" data-duelist-index="1" data-location="SZONE" style="bottom:10px; right:427px;"></div>
          <div class="UIBoard-field-zone js-zone" data-duelist-index="1" data-location="FZONE" style="bottom:150px; right:10px;"></div>
          <div class="UIBoard-field-zone js-zone" data-duelist-index="1" data-location="GRAVEYARD" style="bottom:80px; right:10px;"></div>
          <div class="UIBoard-field-zone js-zone" data-duelist-index="1" data-location="DECK" style="bottom:10px; right:10px;"></div>
          <div class="UIBoard-field-zone js-zone" data-duelist-index="1" data-location="HAND" style="bottom:10px; left:10px;"></div>
        </div>
      </div>`
    });

    this.duel = null;

    this.slots = [];
    this.focusedSlot = null;

    let spellSlot00 = CREATE_CARD_SLOT(0, LOCATION.SZONE, 0, false);
    let spellZone00 = this.node.querySelectorAll(`.js-zone[data-duelist-index="0"][data-location="SZONE"]`)[0];
    spellZone00.appendChild(spellSlot00.node);
    this.slots[SLOT_SPELL_00] = spellSlot00;
  
    let spellSlot01 = CREATE_CARD_SLOT(0, LOCATION.SZONE, 1, false);
    let spellZone01 = this.node.querySelectorAll(`.js-zone[data-duelist-index="0"][data-location="SZONE"]`)[1];
    spellZone01.appendChild(spellSlot01.node);
    this.slots[SLOT_SPELL_01] = spellSlot01;
  
    let spellSlot02 = CREATE_CARD_SLOT(0, LOCATION.SZONE, 2, false);
    let spellZone02 = this.node.querySelectorAll(`.js-zone[data-duelist-index="0"][data-location="SZONE"]`)[2];
    spellZone02.appendChild(spellSlot02.node);
    this.slots[SLOT_SPELL_02] = spellSlot02;
  
    let monsterSlot00 = CREATE_CARD_SLOT(0, LOCATION.MZONE, 0, false);
    let monsterZone00 = this.node.querySelectorAll(`.js-zone[data-duelist-index="0"][data-location="MZONE"]`)[0];
    monsterZone00.appendChild(monsterSlot00.node);
    this.slots[SLOT_MONSTER_00] = monsterSlot00;
  
    let monsterSlot01 = CREATE_CARD_SLOT(0, LOCATION.MZONE, 1, false);
    let monsterZone01 = this.node.querySelectorAll(`.js-zone[data-duelist-index="0"][data-location="MZONE"]`)[1];
    monsterZone01.appendChild(monsterSlot01.node);
    this.slots[SLOT_MONSTER_01] = monsterSlot01;
  
    let monsterSlot02 = CREATE_CARD_SLOT(0, LOCATION.MZONE, 2, false);
    let monsterZone02 = this.node.querySelectorAll(`.js-zone[data-duelist-index="0"][data-location="MZONE"]`)[2];
    monsterZone02.appendChild(monsterSlot02.node);
    this.slots[SLOT_MONSTER_02] = monsterSlot02;
  
    let handSlot00 = CREATE_CARD_SLOT(0, LOCATION.HAND, 0, true);
    let handZone00 = this.node.querySelectorAll(`.js-zone[data-duelist-index="0"][data-location="HAND"]`)[0];
    handZone00.appendChild(handSlot00.node);
    this.slots[SLOT_HAND_00] = handSlot00;
  
    let handSlot01 = CREATE_CARD_SLOT(0, LOCATION.HAND, 1, true);
    handZone00.appendChild(handSlot01.node);
    this.slots[SLOT_HAND_01] = handSlot01;
  
    let handSlot02 = CREATE_CARD_SLOT(0, LOCATION.HAND, 2, true);
    handZone00.appendChild(handSlot02.node);
    this.slots[SLOT_HAND_02] = handSlot02;
  
    let handSlot03 = CREATE_CARD_SLOT(0, LOCATION.HAND, 3, true);
    handZone00.appendChild(handSlot03.node);
    this.slots[SLOT_HAND_03] = handSlot03;
  
    let handSlot04 = CREATE_CARD_SLOT(0, LOCATION.HAND, 4, true);
    handZone00.appendChild(handSlot04.node);
    this.slots[SLOT_HAND_04] = handSlot04;
  
    let handSlot05 = CREATE_CARD_SLOT(0, LOCATION.HAND, 5, true);
    handZone00.appendChild(handSlot05.node);
    this.slots[SLOT_HAND_05] = handSlot05;
  
    let fieldSlot00 = CREATE_CARD_SLOT(0, LOCATION.FZONE, 0, false);
    let fieldZone00 = this.node.querySelectorAll(`.js-zone[data-duelist-index="0"][data-location="FZONE"]`)[0];
    fieldZone00.appendChild(fieldSlot00.node);
    this.slots[SLOT_FIELD_00] = fieldSlot00;
  
    let graveyardSlot00 = CREATE_STACK_SLOT(0, LOCATION.GRAVEYARD, false);
    let graveyardZone00 = this.node.querySelectorAll(`.js-zone[data-duelist-index="0"][data-location="GRAVEYARD"]`)[0];
    graveyardZone00.appendChild(graveyardSlot00.node);
    this.slots[SLOT_GRAVEYARD_00] = graveyardSlot00;
  
    let deckSlot00 = CREATE_STACK_SLOT(0, LOCATION.DECK, true);
    let deckZone00 = this.node.querySelectorAll(`.js-zone[data-duelist-index="0"][data-location="DECK"]`)[0];
    deckZone00.appendChild(deckSlot00.node);
    this.slots[SLOT_DECK_00] = deckSlot00;
  
    // ----------------------------------------------------------------------------------------------------------------------------
  
    let spellSlot10 = CREATE_CARD_SLOT(1, LOCATION.SZONE, 0, false);
    let spellZone10 = this.node.querySelectorAll(`.js-zone[data-duelist-index="1"][data-location="SZONE"]`)[0];
    spellZone10.appendChild(spellSlot10.node);
    this.slots[SLOT_SPELL_10] = spellSlot10;
  
    let spellSlot11 = CREATE_CARD_SLOT(1, LOCATION.SZONE, 1, false);
    let spellZone11 = this.node.querySelectorAll(`.js-zone[data-duelist-index="1"][data-location="SZONE"]`)[1];
    spellZone11.appendChild(spellSlot11.node);
    this.slots[SLOT_SPELL_11] = spellSlot11;
  
    let spellSlot12 = CREATE_CARD_SLOT(1, LOCATION.SZONE, 2, false);
    let spellZone12 = this.node.querySelectorAll(`.js-zone[data-duelist-index="1"][data-location="SZONE"]`)[2];
    spellZone12.appendChild(spellSlot12.node);
    this.slots[SLOT_SPELL_12] = spellSlot12;
  
    let monsterSlot10 = CREATE_CARD_SLOT(1, LOCATION.MZONE, 0, false);
    let monsterZone10 = this.node.querySelectorAll(`.js-zone[data-duelist-index="1"][data-location="MZONE"]`)[0];
    monsterZone10.appendChild(monsterSlot10.node);
    this.slots[SLOT_MONSTER_10] = monsterSlot10;
  
    let monsterSlot11 = CREATE_CARD_SLOT(1, LOCATION.MZONE, 1, false);
    let monsterZone11 = this.node.querySelectorAll(`.js-zone[data-duelist-index="1"][data-location="MZONE"]`)[1];
    monsterZone11.appendChild(monsterSlot11.node);
    this.slots[SLOT_MONSTER_11] = monsterSlot11;
  
    let monsterSlot12 = CREATE_CARD_SLOT(1, LOCATION.MZONE, 2, false);
    let monsterZone12 = this.node.querySelectorAll(`.js-zone[data-duelist-index="1"][data-location="MZONE"]`)[2];
    monsterZone12.appendChild(monsterSlot12.node);
    this.slots[SLOT_MONSTER_12] = monsterSlot12;
  
    let handSlot10 = CREATE_CARD_SLOT(1, LOCATION.HAND, 0, false);
    let handZone10 = this.node.querySelectorAll(`.js-zone[data-duelist-index="1"][data-location="HAND"]`)[0];
    handZone10.appendChild(handSlot10.node);
    this.slots[SLOT_HAND_10] = handSlot10;
  
    let handSlot11 = CREATE_CARD_SLOT(1, LOCATION.HAND, 1, false);
    handZone10.appendChild(handSlot11.node);
    this.slots[SLOT_HAND_11] = handSlot11;
  
    let handSlot12 = CREATE_CARD_SLOT(1, LOCATION.HAND, 2, false);
    handZone10.appendChild(handSlot12.node);
    this.slots[SLOT_HAND_12] = handSlot12;
  
    let handSlot13 = CREATE_CARD_SLOT(1, LOCATION.HAND, 3, false);
    handZone10.appendChild(handSlot13.node);
    this.slots[SLOT_HAND_13] = handSlot13;
  
    let handSlot14 = CREATE_CARD_SLOT(1, LOCATION.HAND, 4, false);
    handZone10.appendChild(handSlot14.node);
    this.slots[SLOT_HAND_14] = handSlot14;
  
    let handSlot15 = CREATE_CARD_SLOT(1, LOCATION.HAND, 5, false);
    handZone10.appendChild(handSlot15.node);
    this.slots[SLOT_HAND_15] = handSlot15;
  
    let fieldSlot10 = CREATE_CARD_SLOT(1, LOCATION.FZONE, 0, false);
    let fieldZone10 = this.node.querySelectorAll(`.js-zone[data-duelist-index="1"][data-location="FZONE"]`)[0];
    fieldZone10.appendChild(fieldSlot10.node);
    this.slots[SLOT_FIELD_10] = fieldSlot10;
  
    let graveyardSlot10 = CREATE_STACK_SLOT(1, LOCATION.GRAVEYARD, false);
    let graveyardZone10 = this.node.querySelectorAll(`.js-zone[data-duelist-index="1"][data-location="GRAVEYARD"]`)[0];
    graveyardZone10.appendChild(graveyardSlot10.node);
    this.slots[SLOT_GRAVEYARD_10] = graveyardSlot10;
  
    let deckSlot10 = CREATE_STACK_SLOT(1, LOCATION.DECK, false);
    let deckZone10 = this.node.querySelectorAll(`.js-zone[data-duelist-index="1"][data-location="DECK"]`)[0];
    deckZone10.appendChild(deckSlot10.node);
    this.slots[SLOT_DECK_10] = deckSlot10;

    this.focusedSlot = deckSlot00;
  }

  update() {
    if (!this.duel) {
      return;
    }

    this.slots[SLOT_SPELL_00].setCard(this.duel.duelists[0].field.szone[0]);
    this.slots[SLOT_SPELL_01].setCard(this.duel.duelists[0].field.szone[1]);
    this.slots[SLOT_SPELL_02].setCard(this.duel.duelists[0].field.szone[2]);
    this.slots[SLOT_MONSTER_00].setCard(this.duel.duelists[0].field.mzone[0]);
    this.slots[SLOT_MONSTER_01].setCard(this.duel.duelists[0].field.mzone[1]);
    this.slots[SLOT_MONSTER_02].setCard(this.duel.duelists[0].field.mzone[2]);
    this.slots[SLOT_FIELD_00].setCard(this.duel.duelists[0].field.fzone[0]);
    this.slots[SLOT_HAND_00].setCard(this.duel.duelists[0].field.hand[0]);
    this.slots[SLOT_HAND_01].setCard(this.duel.duelists[0].field.hand[1]);
    this.slots[SLOT_HAND_02].setCard(this.duel.duelists[0].field.hand[2]);
    this.slots[SLOT_HAND_03].setCard(this.duel.duelists[0].field.hand[3]);
    this.slots[SLOT_HAND_04].setCard(this.duel.duelists[0].field.hand[4]);
    this.slots[SLOT_HAND_05].setCard(this.duel.duelists[0].field.hand[5]);
    this.slots[SLOT_GRAVEYARD_00].setCards(this.duel.duelists[0].field.graveyard);
    this.slots[SLOT_DECK_00].setCards(this.duel.duelists[0].field.deck);
    // --------------------------------------------------------------------------------------------------------
    this.slots[SLOT_SPELL_10].setCard(this.duel.duelists[1].field.szone[0]);
    this.slots[SLOT_SPELL_11].setCard(this.duel.duelists[1].field.szone[1]);
    this.slots[SLOT_SPELL_12].setCard(this.duel.duelists[1].field.szone[2]);
    this.slots[SLOT_MONSTER_10].setCard(this.duel.duelists[1].field.mzone[0]);
    this.slots[SLOT_MONSTER_11].setCard(this.duel.duelists[1].field.mzone[1]);
    this.slots[SLOT_MONSTER_12].setCard(this.duel.duelists[1].field.mzone[2]);
    this.slots[SLOT_FIELD_10].setCard(this.duel.duelists[1].field.fzone[0]);
    this.slots[SLOT_HAND_10].setCard(this.duel.duelists[1].field.hand[0]);
    this.slots[SLOT_HAND_11].setCard(this.duel.duelists[1].field.hand[1]);
    this.slots[SLOT_HAND_12].setCard(this.duel.duelists[1].field.hand[2]);
    this.slots[SLOT_HAND_13].setCard(this.duel.duelists[1].field.hand[3]);
    this.slots[SLOT_HAND_14].setCard(this.duel.duelists[1].field.hand[4]);
    this.slots[SLOT_HAND_15].setCard(this.duel.duelists[1].field.hand[5]);
    this.slots[SLOT_GRAVEYARD_10].setCards(this.duel.duelists[1].field.graveyard);
    this.slots[SLOT_DECK_10].setCards(this.duel.duelists[1].field.deck);

    for (let slot of this.slots) {
      slot.update();
    }
  }

  delete() {
    for (let slot of this.slots) slot.delete();
    super.delete();
  }

  focus() {
    if (this.focusedSlot) {
      this.focusedSlot.focus();
      GWE.eventManager.emit(this, 'E_SLOT_FOCUSED', { slot: this.focusedSlot });
    }

    super.focus();
  }

  unfocus() {
    if (this.focusedSlot) {
      this.focusedSlot.unfocus();
      GWE.eventManager.emit(this, 'E_SLOT_UNFOCUSED');
    }

    super.unfocus();
  }

  getSlots() {
    return this.slots;
  }

  getFocusedSlot() {
    return this.focusedSlot;
  }

  setDuel(duel) {
    for (let slot of this.slots) {
      if (slot instanceof UICardSlot) slot.setCard(null);
      else if (slot instanceof UIStackSlot) slot.setCards(null);
    }

    this.duel = duel ? duel : null;
  }

  focusSlot(slot, emit = true) {
    if (this.focusedSlot) {
      this.focusedSlot.unfocus();
    }

    slot.focus();
    this.focusedSlot = slot;

    if (emit) {
      GWE.eventManager.emit(this, 'E_SLOT_FOCUSED', { slot: this.focusedSlot });
    }
  }

  unfocusSlot(emit = true) {
    if (!this.focusedSlot) {
      return;
    }

    this.focusedSlot.unfocus();
    this.focusedSlot = null;

    if (emit) {
      GWE.eventManager.emit(this, 'E_SLOT_UNFOCUSED');
    }
  }

  // corriger et prendre en compte la distance !
  nextFocus(direction /*UP|RIGHT|DOWN|LEFT*/, emit = false) {
    let rect = this.focusedSlot.node.getBoundingClientRect();
    let centerX = rect.x + (rect.width * 0.5);
    let centerY = rect.y + (rect.height * 0.5);

    let slots = this.slots.slice();
    let closestSlots = slots.sort((a, b) => {
      let rectA = a.node.getBoundingClientRect();
      let rectB = b.node.getBoundingClientRect();

      let centerAX = rectA.x + (rectA.width * 0.5);
      let centerAY = rectA.y + (rectA.height * 0.5);
      let centerBX = rectB.x + (rectB.width * 0.5);
      let centerBY = rectB.y + (rectB.height * 0.5);

      let deltaAX = centerX - centerAX;
      let deltaAY = centerY - centerAY;
      let deltaBX = centerX - centerBX;
      let deltaBY = centerY - centerBY;

      let deltaA = Math.sqrt((deltaAX * deltaAX) + (deltaAY * deltaAY));
      let deltaB = Math.sqrt((deltaBX * deltaBX) + (deltaBY * deltaBY));
      return deltaA - deltaB;
    });

    if (direction == 'UP') {
      closestSlots = closestSlots.filter(slot => {
        let rect = slot.node.getBoundingClientRect();
        return rect.bottom <= centerY && rect.left <= centerX && rect.right >= centerX;
      });
    }
    else if (direction == 'RIGHT') {
      closestSlots = closestSlots.filter(slot => {
        let rect = slot.node.getBoundingClientRect();
        return rect.left >= centerX && rect.top <= centerY && rect.bottom >= centerY;
      });
    }
    else if (direction == 'DOWN') {
      closestSlots = closestSlots.filter(slot => {
        let rect = slot.node.getBoundingClientRect();
        return rect.top >= centerY && rect.left <= centerX && rect.right >= centerX;
      });
    }
    else if (direction == 'LEFT') {
      closestSlots = closestSlots.filter(slot => {
        let rect = slot.node.getBoundingClientRect();
        return rect.right <= centerX && rect.top <= centerY && rect.bottom >= centerY;
      });
    }

    if (closestSlots.length == 0) {
      return;
    }

    this.focusSlot(closestSlots[0], true);
  }

  onKeyDownOnce(data) {
    if (data.key == KEY_CANCEL) {
      GWE.eventManager.emit(this, 'E_ECHAP_PRESSED');
    }
    else if (data.key == KEY_ENTER) {
      GWE.eventManager.emit(this, 'E_ENTER_PRESSED');
    }
    else if (data.key == KEY_UP) {
      this.nextFocus('UP', true);
    }
    else if (data.key == KEY_DOWN) {
      this.nextFocus('DOWN', true);
    }
    else if (data.key == KEY_LEFT) {
      this.nextFocus('LEFT', true);
    }
    else if (data.key == KEY_RIGHT) {
      this.nextFocus('RIGHT', true);
    }
  }
}

module.exports.UIBoard = UIBoard;

// -------------------------------------------------------------------------------------------
// HELPFUL
// -------------------------------------------------------------------------------------------

function CREATE_CARD_SLOT(duelistIndex, location, index, flipped) {
  let slot = new UICardSlot();
  slot.setDuelistIndex(duelistIndex);
  slot.setLocation(location);
  slot.setIndex(index);
  slot.setFlipped(flipped);
  return slot;
}

function CREATE_STACK_SLOT(duelistIndex, location, flipped) {
  let slot = new UIStackSlot();
  slot.setDuelistIndex(duelistIndex);
  slot.setLocation(location);
  slot.setFlipped(flipped);
  return slot;
}