// aus: http://mongoosejs.com/docs/plugins.html

module.exports = exports = function lastModifiedPlugin(schema, options) {
  
  schema.add({  // Basis-Schema wird an alle Schemata vererbt
    archived: {
      type: Boolean,
      default: null // null = Standard, true = archiviert, false = priorisiert
    },
    base: {
      _lastMod: {
        type: Date,
        default: new Date()
      },
      _vItem: {
        type: Number,
        default: 0
      },
      // _vSchema: {
      //   type: Number,
      //   default: 1
      // }
    }
  });
  
  schema.pre('save', function (next) {
    if (!!this.base) {
      this.base._lastMod = new Date();
      this.base._vItem++;
    }
    next();
  });

  if (options && options.index) {
    schema.path('base._lastMod').index(options.index);
  }
}