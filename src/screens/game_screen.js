let { GWE } = require('gwe');
let { DrawCommand, SummonCommand, SetCommand, ChangePositionCommand, BattleCommand, NextPhaseCommand, ActivateCommand } = require('../core/duel_commands');
let { UITurn } = require('../ui/ui_turn');
let { UIDuelist } = require('../ui/ui_duelist');
let { UICardDetail } = require('../ui/ui_card_detail');
let { UIBoard } = require('../ui/ui_board');

class GameScreen extends GWE.Screen {
  constructor(app) {
    super(app);
    this.duel = null;
    this.uiTopBgNode = null;
    this.uiBottomBgNode = null;
    this.uiTurn = null;
    this.uiDuelists = [];
    this.uiCardDetail = null;
    this.uiBoard = null;
    this.uiActionMenu = null;
  }

  onEnter(args) {
    if (!args.duelData) {
      throw new Error('Screen::constructor : duelist0 is missing !');
    }
    if (!args.duelist1) {
      throw new Error('Screen::constructor : duelist1 is missing !');
    }

    this.duel = new Duel();
    this.duel.duelists.push(args.duelist0);
    this.duel.duelists.push(args.duelist1);

    this.uiTopBgNode = document.createElement('img');
    this.uiTopBgNode.src = 'assets/textures/top_background.png';
    GWE.uiManager.addNode(this.uiTopBgNode, 'position:absolute; top:0; right:0; bottom:50%; left:0;');
    this.uiBottomBgNode = document.createElement('img');
    this.uiBottomBgNode.src = 'assets/textures/bottom_background.png';
    GWE.uiManager.addNode(this.uiBottomBgNode, 'position:absolute; top:50%; right:0; bottom:0; left:0;');

    this.uiTurn = new UITurn();
    this.uiTurn.setDuel(this.duel);
    GWE.uiManager.addWidget(this.uiTurn, 'position: absolute; top:0; left:0; right:0; line-height:30px; z-index:100');

    this.uiDuelists.push(new UIDuelist());
    this.uiDuelists[0].setDuelist(this.duel.duelists[0]);
    GWE.uiManager.addWidget(this.uiDuelists[0], 'position:absolute; top:30px; left:0; width:20%');

    this.uiDuelists.push(new UIDuelist());
    this.uiDuelists[1].setDuelist(this.duel.duelists[1]);
    GWE.uiManager.addWidget(this.uiDuelists[1], 'position:absolute; top:30px; right:0; width:20%');

    this.uiCardDetail = new UICardDetail();
    GWE.uiManager.addWidget(this.uiCardDetail, 'position: absolute; top:30px; left:20%; width:60%');

    this.uiBoard = new UIBoard();
    this.uiBoard.setDuel(this.duel);
    GWE.uiManager.addWidget(this.uiBoard, 'position:absolute; top:50%; left:0; right:0; width:100%; height:50%');
    GWE.uiManager.focus(this.uiBoard);

    this.uiActionMenu = new GWE.UIMenu();
    this.uiActionMenu.hide();
    GWE.uiManager.addWidget(this.uiActionMenu, 'position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); z-index:20;');

    GWE.eventManager.subscribe(this.duel, 'E_NEW_TURN', this, this.handleDuelNewTurn);
    GWE.eventManager.subscribe(this.duel, 'E_SELECT_LOCATION', this, this.handleDuelSelectLocation);
    GWE.eventManager.subscribe(this.uiDuelists[0], 'E_ENTER_PRESSED', this, this.handleDuelistEnterPressed);
    GWE.eventManager.subscribe(this.uiDuelists[1], 'E_ENTER_PRESSED', this, this.handleDuelistEnterPressed);
    GWE.eventManager.subscribe(this.uiDuelists[0], 'E_SPACE_PRESSED', this, this.handleDuelistSpacePressed);
    GWE.eventManager.subscribe(this.uiDuelists[1], 'E_SPACE_PRESSED', this, this.handleDuelistSpacePressed);
    GWE.eventManager.subscribe(this.uiBoard, 'E_SLOT_UNFOCUSED', this, this.handleBoardSlotUnfocused);
    GWE.eventManager.subscribe(this.uiBoard, 'E_SLOT_FOCUSED', this, this.handleBoardSlotFocused);
    GWE.eventManager.subscribe(this.uiActionMenu, 'E_CLOSED', this, this.handleActionMenuClosed);
    GWE.eventManager.subscribe(this.uiActionMenu, 'E_MENU_ITEM_SELECTED', this, this.handleActionMenuItemSelected);

    this.duel.startup();
  }

  selectLocation(range, predicateCard, required, response) {
    return new Promise(resolve => {
      GWE.uiManager.focus(this.uiBoard);

      for (let slot of this.uiBoard.slots) {
        for (let i = 0; i < 2; i++) {
          let duelistIndex = i == 0 ? this.duel.getCurrentDuelistIndex() : this.duel.getOpponentDuelistIndex();
          if (range[i] != 0 && slot.duelistIndex == duelistIndex && range[i].includes(slot.location) && predicateCard(slot.card)) {
            slot.setSelectable(true);
          }
        }
      }

      if (!required) {
        Base.subscribe(this.uiBoard, this, 'E_ECHAP_PRESSED', () => {
          Base.unsubscribe(this.uiBoard, this, 'E_ECHAP_PRESSED');
          Base.unsubscribe(this.uiBoard, this, 'E_ENTER_PRESSED');
          this.uiBoard.slots.forEach(slot => slot.setSelectable(false));
          response.state = false;
          resolve();
        });
      }

      Base.subscribe(this.uiBoard, this, 'E_ENTER_PRESSED', () => {
        let focusedSlot = this.uiBoard.focusedSlot;
        if (focusedSlot.selectable) {
          Base.unsubscribe(this.uiBoard, this, 'E_ECHAP_PRESSED');
          Base.unsubscribe(this.uiBoard, this, 'E_ENTER_PRESSED');
          this.uiBoard.slots.forEach(slot => slot.setSelectable(false));
          GWE.uiManager.unfocus();
          response.state = true;
          response.location = focusedSlot.location;
          response.index = focusedSlot.index;
          response.card = focusedSlot.card;
          resolve();
        }
      });
    });
  }

  handleDuelNewTurn() {
    this.uiDuelists[this.duel.getOpponentDuelistIndex()].hideSelection();
    this.uiDuelists[this.duel.getCurrentDuelistIndex()].showSelection();

    if (this.duel.duelists[this.duel.getCurrentDuelistIndex()] instanceof HumanDuelist) {
      GWE.uiManager.focus(this.uiDuelists[this.duel.getCurrentDuelistIndex()]);
    }
  }

  handleDuelSelectLocation(data) {
    return this.selectLocation(data.range, data.predicateCard, data.required, data.response);
  }

  handleBoardSlotUnfocused() {
    this.uiCardDetail.setCard(null);
  }

  handleBoardSlotFocused(data) {
    if (data.slot && data.slot.card && data.slot.flipped == false) {
      this.uiCardDetail.setCard(data.slot.card);
    }
    else {
      this.uiCardDetail.setCard(null);
    }
  }

  handleDuelistEnterPressed() {
    this.uiActionMenu.clear();

    let draw = new DrawCommand(this.duel, 1);
    if (draw.isConditionCheck()) {
      this.uiActionMenu.addItem('Piocher', true, -1, { name: 'DRAW' });
    }

    let summon = new SummonCommand(this.duel);
    if (summon.isConditionCheck()) {
      this.uiActionMenu.addItem('Invoquer', true, -1, { name: 'SUMMON' });
    }

    let set = new SetCommand(this.duel);
    if (set.isConditionCheck()) {
      this.uiActionMenu.addItem('Poser', true, -1, { name: 'SET' });
    }

    let battle = new BattleCommand(this.duel);
    if (battle.isConditionCheck()) {
      this.uiActionMenu.addItem('Attaquer', true, -1, { name: 'BATTLE' });
    }

    let activate = new ActivateCommand(this.duel);
    if (activate.isConditionCheck()) {
      this.uiActionMenu.addItem('Activer', true, -1, { name: 'ACTIVATE' });
    }

    let changePosition = new ChangePositionCommand(this.duel);
    if (changePosition.isConditionCheck()) {
      this.uiActionMenu.addItem('Changer de position', true, -1, { name: 'CHANGE_POSITION' });
    }

    let nextPhase = new NextPhaseCommand(this.duel);
    if (nextPhase.isConditionCheck()) {
      this.uiActionMenu.addItem('Phase suivante', true, -1, { name: 'NEXT_PHASE' });
    }

    this.uiActionMenu.show();
    GWE.uiManager.focus(this.uiActionMenu);
  }

  handleDuelistSpacePressed() {
    GWE.uiManager.focus(this.uiBoard);
    Base.subscribeOnce(this.uiBoard, this, 'E_ECHAP_PRESSED', () => {
      GWE.uiManager.focus(this.uiDuelists[this.duel.getCurrentDuelistIndex()]);
    });
  }

  handleActionMenuClosed() {
    this.uiActionMenu.hide();
    GWE.uiManager.focus(this.uiDuelists[this.duel.getCurrentDuelistIndex()]);
  }

  async handleActionMenuItemSelected(data) {
    this.uiActionMenu.hide();

    if (data.item.dataset.name == 'DRAW') {
      await this.duel.runAction(new DrawCommand(this.duel, 1)); // bizzare
    }
    else if (data.item.dataset.name == 'SUMMON') {
      await this.duel.runAction(new SummonCommand(this.duel));
    }
    else if (data.item.dataset.name == 'SET') {
      await this.duel.runAction(new SetCommand(this.duel));
    }
    else if (data.item.dataset.name == 'BATTLE') {
      await this.duel.runAction(new BattleCommand(this.duel));
    }
    else if (data.item.dataset.name == 'ACTIVATE') {
      await this.duel.runAction(new ActivateCommand(this.duel));
    }
    else if (data.item.dataset.name == 'CHANGE_POSITION') {
      await this.duel.runAction(new ChangePositionCommand(this.duel));
    }
    else if (data.item.dataset.name == 'NEXT_PHASE') {
      await this.duel.runAction(new NextPhaseCommand(this.duel));
    }

    GWE.uiManager.focus(this.uiDuelists[this.duel.getCurrentDuelistIndex()]);
  }
}

module.exports.GameScreen = GameScreen;