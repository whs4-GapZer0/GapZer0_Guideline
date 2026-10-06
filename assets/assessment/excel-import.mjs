// Local-only, bounded OOXML reader for the assessment template. Never evaluates formulas.
import {MAX_IMPORT_BYTES,HEADERS,META_FIELDS,META_LABELS,importRows} from './transfer.mjs?v=control2';
import {crc} from './excel.mjs?v=control6';
const LIMIT=50*1024*1024,decoder=new TextDecoder('utf-8',{fatal:true});
const fail=()=>{throw Error('Excel 파일이 손상되었거나 지원하지 않는 형식입니다. 암호 없이 .xlsx로 저장하세요.');};

export async function readZip(buffer){
 const bytes=new Uint8Array(buffer),view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
 if(bytes.length>MAX_IMPORT_BYTES)throw Error('Excel 파일은 25MB 이하만 불러올 수 있습니다.');
 if(bytes.length<22||view.getUint32(0,true)!==0x04034b50)fail();
 let end=-1;
 for(let i=bytes.length-22;i>=Math.max(0,bytes.length-65557);i--)if(view.getUint32(i,true)===0x06054b50&&i+22+view.getUint16(i+20,true)===bytes.length){end=i;break;}
 if(end<0)fail();
 const count=view.getUint16(end+10,true),size=view.getUint32(end+12,true),start=view.getUint32(end+16,true);
 if(view.getUint16(end+4,true)||view.getUint16(end+6,true)||view.getUint16(end+8,true)!==count||!count||count>512||start+size!==end)fail();
 const entries=new Map();let pos=start,total=0;
 for(let i=0;i<count;i++){
  if(pos+46>end||view.getUint32(pos,true)!==0x02014b50)fail();
  const flags=view.getUint16(pos+8,true),method=view.getUint16(pos+10,true),checksum=view.getUint32(pos+16,true),packed=view.getUint32(pos+20,true),length=view.getUint32(pos+24,true);
  const nl=view.getUint16(pos+28,true),el=view.getUint16(pos+30,true),cl=view.getUint16(pos+32,true),offset=view.getUint32(pos+42,true);
  if(pos+46+nl+el+cl>end||flags&0x41||![0,8].includes(method)||view.getUint16(pos+34,true)||offset+30>start)fail();
  const name=decoder.decode(bytes.subarray(pos+46,pos+46+nl));
  if(!name||name.startsWith('/')||name.includes('\\')||name.split('/').some(p=>p==='..'||p==='.')||entries.has(name))fail();
  if(view.getUint32(offset,true)!==0x04034b50||view.getUint16(offset+6,true)!==flags||view.getUint16(offset+8,true)!==method)fail();
  const localName=view.getUint16(offset+26,true),localExtra=view.getUint16(offset+28,true),dataStart=offset+30+localName+localExtra;
  if(dataStart+packed>start||decoder.decode(bytes.subarray(offset+30,offset+30+localName))!==name)fail();
  total+=length;if(total>LIMIT)throw Error('압축 해제한 Excel 내용이 너무 큽니다. 불필요한 시트와 서식을 제거하세요.');
  const data=bytes.subarray(dataStart,dataStart+packed);let output;
  if(method===0){if(packed!==length)fail();output=data;}
  else{
   let stream;try{stream=new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'));}catch{throw Error('이 브라우저에서는 Excel를 읽을 수 없습니다. 최신 Chrome 또는 Edge를 사용하세요.');}
   const reader=stream.getReader(),chunks=[];let actual=0;
   try{while(true){const {done,value}=await reader.read();if(done)break;actual+=value.length;if(actual>length||actual>LIMIT){await reader.cancel();fail();}chunks.push(value);}}finally{reader.releaseLock();}
   if(actual!==length)fail();output=new Uint8Array(actual);let at=0;for(const chunk of chunks){output.set(chunk,at);at+=chunk.length;}
  }
  if(crc(output)!==checksum)fail();entries.set(name,output);pos+=46+nl+el+cl;
 }
 if(pos!==end)fail();return entries;
}
const nodes=(node,name)=>Array.from(node.getElementsByTagNameNS('*',name));
function documentXml(entries,path){
 const bytes=entries.get(path);if(!bytes)fail();
 let text;try{text=decoder.decode(bytes);}catch{fail();}
 if(/<!DOCTYPE|<!ENTITY/i.test(text))fail();
 const doc=new DOMParser().parseFromString(text,'application/xml');if(nodes(doc,'parsererror').length)fail();return doc;
}
function resolve(base,target){
 if(!target||/[\\:#?]/.test(target))fail();
 const parts=target.startsWith('/')?[]:base.split('/').slice(0,-1);
 for(const p of target.split('/')){if(!p||p==='.')continue;if(p==='..'){if(!parts.length)fail();parts.pop();}else parts.push(p);}
 return parts.join('/');
}
function relationships(entries,base){
 const at=base.lastIndexOf('/'),path=base?base.slice(0,at+1)+'_rels/'+base.slice(at+1)+'.rels':'_rels/.rels';
 return nodes(documentXml(entries,path),'Relationship').map(n=>({id:n.getAttribute('Id'),type:n.getAttribute('Type').split('/').pop(),target:n.getAttribute('Target'),external:n.getAttribute('TargetMode')==='External'}));
}
function related(base,rel){if(!rel||rel.external)fail();return resolve(base,rel.target);}
// Decode OOXML escapes once, so escaped literal _xNNNN_ strings remain literal.
const unescape=s=>s.replace(/_x([0-9a-f]{4})_/gi,(_,h)=>String.fromCharCode(parseInt(h,16)));
const richText=node=>unescape(nodes(node,'t').filter(n=>n.parentNode.localName!=='rPh').map(n=>n.textContent).join(''));
const dateHeaders=new Set(['완료 예정일','완료일','평가기간 시작일','평가기간 종료일','평가일']);
function serialDate(value,date1904){
 const n=Number(value);
 if(!Number.isInteger(n)||n<0||(!date1904&&n===60))throw Error('날짜 셀에 올바른 날짜를 입력하세요. 시간은 포함하지 않습니다.');
 const ms=(n-(date1904?24107:n<60?25568:25569))*86400000;
 if(!Number.isFinite(ms)||ms>Date.UTC(9999,11,31))fail();
 const result=new Date(ms).toISOString().slice(0,10);if(!/^\d{4}-\d{2}-\d{2}$/.test(result))fail();return result;
}
export async function xlsxRows(buffer){
 const entries=await readZip(buffer),types=documentXml(entries,'[Content_Types].xml');
 if(nodes(types,'Override').some(n=>/macroEnabled|vbaProject/i.test(n.getAttribute('ContentType'))))throw Error('매크로가 없는 .xlsx 파일을 사용하세요.');
 const bookPath=related('',relationships(entries,'').find(r=>r.type==='officeDocument'));
 const book=documentXml(entries,bookPath),rels=relationships(entries,bookPath);
 const sheets=nodes(book,'sheet').filter(n=>n.getAttribute('name')==='평가 기록');
 if(sheets.length!==1)throw Error('평가 기록 시트를 찾을 수 없습니다. 이 사이트의 Excel 템플릿을 사용하세요.');
 const sheetId=Array.from(sheets[0].attributes).find(a=>a.localName==='id')?.value;
 const sheetRel=rels.find(r=>r.id===sheetId&&r.type==='worksheet');
 const sheet=documentXml(entries,related(bookPath,sheetRel)),sharedRel=rels.find(r=>r.type==='sharedStrings');
 const strings=sharedRel?nodes(documentXml(entries,related(bookPath,sharedRel)),'si').map(richText):[];
 const date1904=['1','true'].includes(nodes(book,'workbookPr')[0]?.getAttribute('date1904'));
 const rows=[],meta={},seenRows=new Set();let cells=0;
 for(const row of nodes(sheet,'row')){
  const r=Number(row.getAttribute('r'));if(!Number.isInteger(r)||r<1||r>1000||seenRows.has(r))fail();seenRows.add(r);
  const values=Array(HEADERS.length).fill(''),seen=new Set();
  for(const cell of nodes(row,'c')){
   if(++cells>24000)fail();
   const match=/^([A-Z]+)([1-9]\d*)$/.exec(cell.getAttribute('r')||'');if(!match||Number(match[2])!==r)fail();
   const col=[...match[1]].reduce((n,c)=>n*26+c.charCodeAt(0)-64,0)-1;
   if(seen.has(col))fail();seen.add(col);
   if(nodes(cell,'f').length)throw Error('평가 기록에 수식이 있습니다. 수식 대신 계산 결과를 값으로 붙여넣어 저장하세요.');
   const type=cell.getAttribute('t'),raw=nodes(cell,'v')[0]?.textContent??'';let value='';
   if(type==='inlineStr')value=richText(cell);
   else if(type==='s'){const index=Number(raw);if(!/^\d+$/.test(raw)||!Number.isSafeInteger(index)||index>=strings.length)fail();value=strings[index];}
   else if(type==='e')throw Error('평가 기록에 Excel 오류 값이 있습니다. 내용을 확인하세요.');
   else if(['str','d','b'].includes(type))value=unescape(raw);
   else if(!type||type==='n'){if(raw&&!Number.isFinite(Number(raw)))fail();value=raw;}
   else fail();
   if(col>=HEADERS.length){if(value)throw Error('이전 질문별 템플릿 또는 지원하지 않는 열 구조입니다. 새 Control 자가진단 템플릿을 사용하세요.');continue;}
   if(value&&((r>8&&dateHeaders.has(rows[0]?.[col]))||(col===1&&[3,4,6].includes(r)))){
    if(!type||type==='n')value=serialDate(value,date1904);
    else if(type==='d'&&/^\d{4}-\d{2}-\d{2}T00:00:00(?:\.0+)?Z?$/.test(value))value=value.slice(0,10);
   }
   values[col]=value;
  }
  if(r===1&&values[0]!=='GapZer0 Control 자가진단')throw Error('새 Control 자가진단 템플릿을 사용하세요. 기존 질문별 파일은 자동 변환하지 않습니다.');
  if(r>=2&&r<=6){if(values[0]!==META_LABELS[r-2])throw Error('상단 평가 기본정보의 항목과 위치를 유지하세요.');meta[META_FIELDS[r-2]]=values[1];}
  if(r===8){if(rows.length)fail();rows.push(values);}
  else if(r>8&&values.some(Boolean)){if(!rows.length)fail();rows.push(values);}
 }
 if(META_FIELDS.some(k=>!(k in meta)))throw Error('상단 평가 기본정보 행을 유지하세요.');
 return {rows,meta};
}
export async function importXlsx(buffer,bank){const {rows,meta}=await xlsxRows(buffer);return importRows(rows,bank,meta);}
