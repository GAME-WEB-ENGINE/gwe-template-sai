let { GWE } = require('gwe');

class UIStackSlot extends GWE.UIWidget {
  constructor() {
    super({
      className: 'UIStackSlot',
      template: `
        <div class="UIStackSlot-bg js-bg"></div>
        <div class="UIStackSlot-numCards js-num-cards"></div>`
    });

    this.cards = [];
    this.duelistIndex = 0;
    this.location = '';
    this.flipped = false;
    this.selectable = false;
  }

  update() {
    if (this.cards.length > 0) {
      let lastCard = this.cards[this.cards.length - 1];
      this.node.querySelector('.js-bg').style.backgroundImage = this.flipped ? 'url(assets/textures/card_back.png)' : 'url(' + lastCard.getCoverFile() + ')';
      this.node.querySelector('.js-num-cards').textContent = this.cards.length;
    }
    else {
      this.node.querySelector('.js-bg').style.backgroundImage = 'url()';
      this.node.querySelector('.js-num-cards').textContent = 0;
    }

    this.node.classList.toggle('u-selectable', this.selectable);
  }

  setCards(cards) {
    this.cards = cards ? cards : [];
  }

  getDuelistIndex() {
    return this.duelistIndex;
  }

  setDuelistIndex(duelistIndex) {
    this.duelistIndex = duelistIndex;
  }

  getLocation() {
    return this.location;
  }

  setLocation(location) {
    this.location = location;
  }

  isFlipped() {
    return this.flipped;
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

module.exports.UIStackSlot = UIStackSlot;