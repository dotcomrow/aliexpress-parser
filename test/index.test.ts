import Parser from '../src/Parser.js';

var parser = new Parser();
parser.search('iphone').then((item) => {
    
    console.log(item);
});