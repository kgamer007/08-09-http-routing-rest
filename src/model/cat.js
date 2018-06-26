'use strict';

const uuid = require('uuid/v4');
const storage = require('../lib/storage');

module.exports = class Cats {
  constructor(config) {
    this._id = uuid();
    this.createdOn = new Date();
    this.title = config.title;
    this.content = config.content || '';
    this.age = config.age;
    this.weight = config.weight;
    this.color = config.color;
  }
  
  save() {
    return storage.save('Cats', this);
  }

  static fetchAll() {
    return storage.getAll('Cats');
  }

  static findById(_id) {
    return storage.get('Cats', _id);
  }

  static findByWeight(weight) {
    return storage.getByKey('Cats', { weight });
  }

  static findByColor(color) {
    return storage.getByKey('Cats', { color });
  }

  static findByAge(age) {
    return storage.getByKey('Cats', { age });
  }

  static update(data) {
    // TODO: Bonus to write code here teo update a user in the storage module by targeting their ID
    return storage.update('Cats', data);
  }

  static delete(_id) {
    // TODO: write code here to delete a user in the storage module by targeting their id
    return storage.delete('Cats', _id);
  }
};
