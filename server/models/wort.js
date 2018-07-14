// Wort ist hier das HyperWort, das heißt meist ein Ausdruck ohne Leerzeichen in CamelCase: z.B. ProjektPlanen, GeschaeftsIdeen
// gleichzeitig auch der HyperSatz
const { mongoose } = require('./../db/mongoose');


const WortSchema = new mongoose.Schema({
  // vorher Wort
  wort: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  satzteileIn: [mongoose.Schema.Types.ObjectId], // Satzteile, in denen das aktuelle wort vorkommt (ObjectIds)
  satzteileIf: [mongoose.Schema.Types.ObjectId], // Satzteile, bei denen der aktuelle wort Bedingung für deren Gükltigkeit/Existenz ist (ObjectId)
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
  },
  // vorher Satz
  satzteile: [{  // ein Wort kann mehrere Satzteile beschriften (z.B. Liste + Tag), bei 2 oder mehr Satzteilen gleichen Typs (z.B. 2 Listen) muss die Satzteil-ObjectId (ggf. auch der Index) angegeben werden
    typ: {  // Satzteiltyp = Typ der geordneten Liste = Beispiele: echter Satz, Liste, Tag, Erbfolge, Linkkette, Objekt, lose Gruppe, Absatz, Details, Dateipfad, url, Nachrichtenprotokoll, sh. auch html5-Tags
      type: String,
      required: true
    },
    worte: [mongoose.Schema.Types.ObjectId], // worte in der richtigen Reihenfolge ergeben den satzteil
    worteIf: [mongoose.Schema.Types.ObjectId], // Bedingung für die Gültigkeit des Satzteils
    stats: {
      maxNesting: Number, // maximale Verschachtelungstiefe des Satzteils
      avNesting: Number, // mittlere Verschachtelungstiefe des Satzteils
      anzBasisworte: Number
    }
  }],
  satzStats: {
    maxNesting: Number, // maximale Verschachtelungstiefe des Satzes
    avNesting: Number, // mittlere Verschachtelungstiefe des Satzes
    anzBasisworte: Number
  }
});
// }, { discriminatorKey: '_type' });

const Wort = mongoose.model('Wort', WortSchema);

module.exports = { Wort };
