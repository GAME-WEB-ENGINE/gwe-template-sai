// DONE

let { GWE } = require('gwe');
let { CARD_POS } = require('../core/enums');

class UICardSlot extends GWE.UIWidget {
  constructor() {
    super({
      className: 'UICardSlot',
      template: `
      <div class="UICardSlot-bg js-bg"></div>`
    });

    this.card = null;
    this.duelistIndex = 0;
    this.location = '';
    this.index = 0;
    this.flipped = false;
    this.selectable = false;
  }

  update() {
    if (this.card) {
      this.node.style.transform = `rotate(${this.card.getPosition() == CARD_POS.DEFENSE ? '90deg' : '0deg'})`;
      this.node.querySelector('.js-bg').style.backgroundImage = this.flipped ? 'url(assets/textures/card_back.png)' : 'url(' + this.card.getCoverFile() + ')';
    }
    else {
      this.node.style.transform = 'rotate(0deg)';
      this.node.querySelector('.js-bg').style.backgroundImage = 'url()';
    }

    this.node.classList.toggle('u-selectable', this.selectable);
  }

  setCard(card) {
    this.card = card ? card : null;
  }

  setDuelistIndex(duelistIndex) {
    this.duelistIndex = duelistIndex;
  }

  setLocation(location) {
    this.location = location;
  }

  setIndex(index) {
    this.index = index;
  }

  setFlipped(flipped) {
    this.flipped = flipped;
  }

  isSelectable() {
    return this.selectable;
  }

  setSelectable(selectable) {
    this.selectable = selectable;
  }
}

module.exports.UICardSlot = UICardSlot;