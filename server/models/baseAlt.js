// Basis-Schema, welches an alle Schemata vererbt wird

const { mongoose } = require('./../db/mongoose');

var BaseSchema = new mongoose.Schema({ // BaseSchema wird vererbt und erweitert
  archived: {
    type: Boolean,
    default: null // null = Standard, true = archiviert, false = priorisiert
  },
  time: {
    archivedAt: {
      type: Number,
      default: null
    },
    createdAt: {
      type: Number,
      default: new Date().getTime()
    },
    lastModified: {
      type: Number,
      default: new Date().getTime()
    }
  },
  _vItem: {
    type: Number,
    default: 1
  },
  _vSchema: {
    type: Number,
    default: 1
  }
}, { discriminatorKey: '_type' });

const Base = mongoose.model('Base', BaseSchema);


module.exports = { BaseSchema };
