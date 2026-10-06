import {deflateRawSync} from 'node:zlib';
import {readZip} from '../assets/assessment/excel-import.mjs';
import {crc} from '../assets/assessment/excel.mjs';
// Independent compressed ZIP packaging to exercise files resaved by spreadsheet editors.
export function compressedZip(entries){
 const locals=[],central=[];let offset=0;
 for(const [name,text]of entries){
  const n=Buffer.from(name),raw=Buffer.from(text),data=deflateRawSync(raw),checksum=crc(raw);
  const h=Buffer.alloc(30);h.writeUInt32LE(0x04034b50);h.writeUInt16LE(20,4);h.writeUInt16LE(8,8);h.writeUInt32LE(checksum,14);h.writeUInt32LE(data.length,18);h.writeUInt32LE(raw.length,22);h.writeUInt16LE(n.length,26);
  const c=Buffer.alloc(46);c.writeUInt32LE(0x02014b50);c.writeUInt16LE(20,4);c.writeUInt16LE(20,6);c.writeUInt16LE(8,10);c.writeUInt32LE(checksum,16);c.writeUInt32LE(data.length,20);c.writeUInt32LE(raw.length,24);c.writeUInt16LE(n.length,28);c.writeUInt32LE(offset,42);
  locals.push(h,n,data);central.push(c,n);offset+=h.length+n.length+data.length;
 }
 const directory=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(entries.size,8);end.writeUInt16LE(entries.size,10);end.writeUInt32LE(directory.length,12);end.writeUInt32LE(offset,16);
 return Buffer.concat([...locals,directory,end]);
}
export async function editXlsx(bytes,edit=()=>{}){
 const entries=new Map([...await readZip(bytes)].map(([k,v])=>[k,new TextDecoder().decode(v)]));edit(entries);return compressedZip(entries);
}
export async function sharedStringXlsx(bytes,date1904=false){
 return editXlsx(bytes,entries=>{
  const strings=[];let sheet=entries.get('xl/worksheets/sheet1.xml');
  sheet=sheet.replace(/<c ([^>]*?)t="inlineStr"><is>([\s\S]*?)<\/is><\/c>/g,(_,attrs,text)=>{strings.push('<si>'+text+'</si>');return `<c ${attrs}t="s"><v>${strings.length-1}</v></c>`;});
  if(date1904){
   entries.set('xl/workbook.xml',entries.get('xl/workbook.xml').replace('<bookViews>','<workbookPr date1904="1"/><bookViews>'));
   sheet=sheet.replace(/(<c r="(?:P|R|U|V|X)\d+" s="11"><v>)(\d+)(<\/v>)/g,(_,a,n,b)=>a+(Number(n)-1462)+b);
  }
  entries.set('xl/worksheets/sheet1.xml',sheet);
  entries.set('xl/sharedStrings.xml','<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'+strings.join('')+'</sst>');
  entries.set('xl/_rels/workbook.xml.rels',entries.get('xl/_rels/workbook.xml.rels').replace('</Relationships>','<Relationship Id="shared" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/></Relationships>'));
 });
}
