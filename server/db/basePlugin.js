// aus: http://mongoosejs.com/docs/plugins.html

module.exports = exports = function lastModifiedPlugin(schema, options) {
  schema.add({  // Basis-Schema wird an alle Schemata vererbt
    _lastMod: {
      type: Date,
      default: new Date()
    },
    _vItem: {
      type: Number,
      default: 1
    },
    _vSchema: {
      type: Number,
      default: 1
    },
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
    }
  });

  schema.pre('save', function (next) {
    this._lastMod = new Date();
    this._vItem++;
    next();
  });

  if (options && options.index) {
    schema.path('lastMod').index(options.index);
  }
}