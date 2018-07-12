// Satz ist hier der HyperSatz, das heißt ein oder meherere geordnete Listen (echter Satz, Liste, Tag, Erbfolge, Linkkette) von HyperWorten (deren ObjectIds): z.B. GeschaeftsIdeen -> ProjektPlanen -> GewinneMachen

const { mongoose } = require('./../db/mongoose');
const extend = require('mongoose-schema-extend');
const { WortSchema } = require('./wort');

var SatzSchema = WortSchema.extend({ // WortSchema wird vererbt und erweitert, jeder Satz ist gleichzeitig wieder ein Wort (für die nächste Ebene)
  satzteile: [{  // ein Wort kann mehrere Satzteile beschriften (z.B. Liste + Tag), bei 2 oder mehr Satzteilen gleichen Typs (z.B. 2 Listen) muss die Satzteil-ObjectId (ggf. auch der Index) angegeben werden
    typ: {  // Satzteiltyp = Typ der geordneten Liste = Liste, Tag, Erbfolge, Linkkette
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

const Satz = mongoose.model('Satz', SatzSchema);


module.exports = { Satz };
