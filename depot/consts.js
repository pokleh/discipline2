'use strict';

const Enum = require('./Enum');

const TrackerType = new Enum({
  GOAL_TRACKER: {
    title: 'Daily Goal',
    value: 'goal',
    desc: 'Make a daily goal and set it as reached with the help of this tracker, ' +
          'e.g., track when you visit a gym.'
  },

  COUNTER: {
    title: 'Counter',
    value: 'counter',
    desc: 'Count the number of one particular activity you do during the day, ' +
          'e.g., number of coffee cups you drink.'
  },

  SUM: {
    title: 'Sum',
    value: 'sum',
    desc: 'Track expenses you make during the day for one particular category, ' +
          'e.g, an amount you spend on lunch.'
  }
});

module.exports = {
  TrackerType
};
