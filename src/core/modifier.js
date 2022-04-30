class Modifier {
  constructor(data) {
    this.id = '';
    this.type = '';
    this.attributeKey = '';
    this.value = 0;
    this.stackable = false;
    this.linked = false;
    this.linkedEffect = null;

    if (!data.hasOwnProperty('Type')) {
      return;
    }
    if (!(
      data['Type'] == 'MUL' ||
      data['Type'] == 'ADD' ||
      data['Type'] == 'SUB' ||
      data['Type'] == 'SET' ||
      data['Type'] == 'FIN')) {
      return;
    }
    if (!data.hasOwnProperty('AttributeKey')) {
      return;
    }
    if (!data.hasOwnProperty('Value')) {
      return;
    }
    if (!data.hasOwnProperty('Stackable')) {
      return;
    }
    if (!data.hasOwnProperty('Linked')) {
      return;
    }

    this.id = data['Type'] + '_' + data['AttributeKey'];
    this.type = data['Type'];
    this.attributeKey = data['AttributeKey'];
    this.value = data['Value'];
    this.stackable = data['Stackable'];
    this.linked = data['Linked'];
  }

  getId() {
    return this.id;
  }

  getType() {
    return this.type;
  }

  getAttributeKey() {
    return this.attributeKey;
  }

  getValue() {
    return this.value;
  }

  isStackable() {
    return this.stackable;
  }

  isLinked() {
    return this.linked;
  }

  getLinkedEffect() {
    return this.linkedEffect;
  }

  setLinkedEffect(linkedEffect) {
    this.linkedEffect = linkedEffect;
  }
}

module.exports.Modifier = Modifier;