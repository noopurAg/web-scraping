const rp = require('request-promise');
const otcsv = require('objects-to-csv');
const cheerio = require('cheerio');

const baseURL = 'https://developer.ibm.com/cloudautomation/tutorials/';
const searchURL = 'category/orchestration';

const getDocInfo = async () => {
    const html = await rp(baseURL + searchURL);
    //console.log ("html" , html)
    const businessMap = cheerio('div.ibm-card__content', html).map(async (i, e) => {
        const name = e.children[0].name;

        const atag = cheerio('a',e.children[0])
        const ptag =  cheerio('p',e.children[0])

        const doclink = atag[0].attribs.href
        const innerHtml = await rp(doclink);
        const docDesc = cheerio('h1.entry-title',innerHtml).text();
        const newline = ""
  
       return {
        doclink,
        newline,
        docDesc 
     }
    }).get();
    return Promise.all(businessMap);
  };

  getDocInfo()
  .then(result => {
    const transformed = new otcsv(result);
    return transformed.toDisk('./output.csv');
  })
  .then(() => console.log('SUCCESSFULLY COMPLETED THE WEB SCRAPING DevCenter CAM'));