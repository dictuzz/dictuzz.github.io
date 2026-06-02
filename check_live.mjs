// Check if changes are deployed on the live site

async function check() {
  // Check framework.js
  const fwRes = await fetch('https://dictuzz.me/resources/assets/chunks/framework.BGh0NSIy.js');
  const fwText = await fwRes.text();
  
  const hasCuFix = fwText.includes('return"/resources/"+e');
  const hasNuFix = fwText.includes('/resources/');
  const hasOldNu = fwText.includes('const n="/"');
  
  console.log('=== framework.js (LIVE) ===');
  console.log('cu() fixed:', hasCuFix);
  console.log('has /resources/ anywhere:', hasNuFix);
  console.log('has old const n="/":',  hasOldNu);
  
  // Check index.html for base value
  const htmlRes = await fetch('https://dictuzz.me/resources/index.html');
  const htmlText = await htmlRes.text();
  
  const BS = String.fromCharCode(92, 34);
  const hasNewBase = htmlText.includes(BS + 'base' + BS + ':' + BS + '/resources/' + BS);
  const hasOldBase = htmlText.includes(BS + 'base' + BS + ':' + BS + '/' + BS);
  
  console.log('\n=== index.html (LIVE) ===');
  console.log('has /resources/ base:', hasNewBase);
  console.log('has old / base:', hasOldBase);
  
  // Also check what cleanUrls is set to
  const cleanUrlsIdx = htmlText.indexOf('cleanUrls');
  if (cleanUrlsIdx > -1) {
    console.log('cleanUrls context:', htmlText.substring(cleanUrlsIdx, cleanUrlsIdx + 20));
  }
  
  // Check the hash map
  const hashMapIdx = htmlText.indexOf('__VP_HASH_MAP__');
  if (hashMapIdx > -1) {
    const hmEnd = htmlText.indexOf(')', hashMapIdx);
    const hmStr = htmlText.substring(hashMapIdx, Math.min(hmEnd + 1, hashMapIdx + 200));
    console.log('\nHash map snippet:', hmStr.substring(0, 150));
  }
}

check().catch(e => console.error(e));
