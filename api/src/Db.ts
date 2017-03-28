const Cot = require('cot');

export const cot = new Cot({hostname: 'localhost', port: 5984});

export const db = cot.db('editstation');
