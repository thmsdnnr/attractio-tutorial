const $={
  wsPingInterval:15000 //ms
};

const ADJS=["divine","elegant","classy","winning","winsome","comely","luring","pretty","radiant","siren","angelic","sublime","refined","lovable","darling","magical","sweet"];;
const ANIMALS=["zebra","cat","gazelle","raccoon","yak","otter","hyena","puma"];
const URL_ADJS=["elastic","elated","elfin","elite","enchanted","endurable","exuberant","exultant","fabulous","fearless","fierce","hallowed","immense","jazzy","lavish","luxuriant","lyrical","melodic","nimble","oceanic","optimal","placid","quirky","sassy","savory","spiffy","swanky","ultra"];

const randHex = () => parseInt(Math.floor(Math.random()*255)).toString(16);
const rIn = () => Math.floor(Math.random()*255);
const rArr = (arr) => arr[Math.floor(Math.random()*(arr.length-1))];
const randomURL = () =>rArr(ADJS)+"-"+rArr(URL_ADJS)+"-"+rArr(ANIMALS);
const randomRGB = () => `rgba(${rIn()},${rIn()},${rIn()},1.0)`
const randomString = (idx) =>rArr(ADJS)+" "+rArr(ANIMALS);
const remove = (arr, ele) => {
  if (!(arr&&Array.isArray(arr))||(!(ele&&Number.isInteger(ele)))) { return null; }
  return arr.indexOf(ele)!==-1 ? arr.filter(e=>e!==ele) : arr;
}
const promote = (arr, ele) => {
  if (!arr||!ele) { return false; }
  if (arr.length===1) { return arr; }
  let idx = arr.indexOf(ele);
  return (idx!==-1) ? [ele].concat(arr.slice(0,idx),arr.slice(idx+1)) : arr;
}

module.exports = { $, randHex, rIn, rArr, randomURL, randomRGB, randomString, remove, promote};
