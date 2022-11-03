const csv = require('csv-parser');
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const fs = require('fs');
const Transform = require('stream').Transform;

const csvStringifier = createCsvStringifier({
  header: [{
    id: 'id', title: 'id'
  }, {
    id: 'answer_id', title: 'answer_id'
  }, {
    id: 'url', title: 'url'
  }]
});

let readStream = fs.createReadStream("server/data/test.csv");
let writeStream = fs.createWriteStream("server/data/cleanTest.csv");

class CSVCleaner extends Transform {
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, next) {
    for (let key in chunk) {
      // trims whitespace
      let trimKey = key.trim();
      chunk[trimKey] = chunk[key];
      if (key !== trimKey) {
        delete chunk[key];
      }
    }
    // filters out all non-number characters
    let onlyIdNumbers = chunk.id.replace(/\D/g, '');
    let onlyAnswerIdNumbers = chunk.answer_id.replace(/\D/g, '');
    chunk.id = onlyIdNumbers;
    chunk.answer_id = onlyAnswerIdNumbers;

    // use our csvStringifier to turn our chunk into a csv string
    chunk = csvStringifier.stringifyRecords([chunk]);

    let commaCount = 0;
    let quoteInsertIndex;

    for (let i = 0; i < chunk.length; i++) {
      if (chunk[i] === ',') {
        commaCount++
        if (commaCount === 2) {
          quoteInsertIndex = i + 1;
        }
      }
    }


    let text = chunk.slice(0, quoteInsertIndex) + '"' + chunk.slice(quoteInsertIndex).trim();
    let result = text.concat(`"\n`);

    this.push(result);

    next();
  }
}

const transformer = new CSVCleaner({ writableObjectMode: true });

//write header
writeStream.write(csvStringifier.getHeaderString());
readStream
  .pipe(csv())
  .pipe(transformer)
  .pipe(writeStream)
  .on('finish', () => { console.log('finished transforming products'); });