// Wort ist hier das HyperWort, das heißt meist ein Ausdruck ohne Leerzeichen in CamelCase: z.B. ProjektPlanen, GeschaeftsIdeen
const { mongoose } = require('./../db/mongoose');

// !!! hier: 
// neues Projekt: utxt
// hyperwort.de, hyperwort.com registrieren

// tests aktualisieren
// seed2 zu testen der Datenbankspeicherung (Mongoose.save)

// , ggf. zirkuläre Sätze ermitteln in 2D, 3D, xD
// Usergruppen mit Rechten
// Utxt Patent anmelden
const WortSchema = new mongoose.Schema({
  wort: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  satzteileIn: [mongoose.Schema.Types.ObjectId], // Satzteile, in denen das aktuelle wort vorkommt (ObjectIds)
  satzteileIf: [mongoose.Schema.Types.ObjectId], // Satzteile, bei denen der aktuelle wort Bedingung für deren Gükltigkeit/Existenz ist (ObjectId)
  archived: {
    type: Boolean,
    default: null // null = Standard, true = archiviert, false = priorisiert
  },
  time: {
    archivedAt: {
      type: Number,
      default: null
    },
    lastModified: {
      type: Number,
      default: new Date().getTime()
    },
    createdAt: {
      type: Number,
      default: new Date().getTime()
    }
  },
  wortuser: {
    _creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    _editors: [{
      editor: mongoose.Schema.Types.ObjectId,
      right: {  // wird noch nicht verwendet
        type: String,
        enum: [null, 'none', 'read', 'write', 'move', 'write-read', 'move-read', 'move-write', 'move-write-read'],
        default: 'none'
      }
    }]
  }
}, { discriminatorKey: '_type' });

const Wort = mongoose.model('Wort', WortSchema);

module.exports = { Wort, WortSchema };
