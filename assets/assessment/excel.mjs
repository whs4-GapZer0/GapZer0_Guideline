import {HEADERS,META_FIELDS,META_LABELS} from './transfer.mjs?v=control2';
// A small, write-only XLSX exporter. No macros, formulas or external links.
// The ZIP entries are stored without compression so no runtime dependency is needed.
const enc=new TextEncoder();
const xml=value=>String(value??'').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffe\uffff]/g,'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const NS='http://schemas.openxmlformats.org/spreadsheetml/2006/main';
const REL='http://schemas.openxmlformats.org/package/2006/relationships';
const declaration='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
const col=i=>String.fromCharCode(65+i);
const widths=[18,36,18,55,55,55,22,19,18];
function cell(value,i,row,style=0,date=false){
 const text=String(value??'');
 if(text.length>32767)throw Error('Excel 한 셀에 저장할 수 있는 글자 수를 초과했습니다.');
 const ref=col(i)+row;
 if(date&&/^\d{4}-\d{2}-\d{2}$/.test(text)&&!Number.isNaN(Date.parse(text)))return `<c r="${ref}" s="11"><v>${Date.parse(text)/86400000+25569}</v></c>`;
 const safe=xml(text.replace(/_x[0-9a-f]{4}_/gi,m=>'_x005F_'+m.slice(1))).replace(/\r/g,'&#13;');
 return `<c r="${ref}" s="${style}" t="inlineStr"><is><t xml:space="preserve">${safe}</t></is></c>`;
}
function height(values,cols){
 let lines=2;
 values.forEach((v,i)=>{const n=String(v??'').split(/\r?\n/).reduce((sum,line)=>sum+Math.max(1,Math.ceil([...line].reduce((w,c)=>w+(c.charCodeAt(0)>255?2:1),0)/(cols[i]-3))),0);lines=Math.max(lines,n);});
 return Math.min(409,lines*16+12);
}
function styles(){
 const fonts=['<font><sz val="11"/><name val="맑은 고딕"/><color rgb="FF243746"/></font>',...['FFFFFF','2563EB','15803D','F59E0B'].map(color=>`<font><b/><sz val="11"/><name val="맑은 고딕"/><color rgb="FF${color}"/></font>`)];
 const fills=['<fill><patternFill patternType="none"/></fill>','<fill><patternFill patternType="gray125"/></fill>',...['34343C','AD450E','765B49','475569','F1F5F9','FFF7E7'].map(color=>`<fill><patternFill patternType="solid"><fgColor rgb="FF${color}"/><bgColor indexed="64"/></patternFill></fill>`)];
 const xf=(font,fill,num=0)=>`<xf numFmtId="${num}" fontId="${font}" fillId="${fill}" borderId="0" xfId="0" applyAlignment="1" applyNumberFormat="1"><alignment vertical="top" wrapText="1"/></xf>`;
 const formats=[xf(0,0),xf(1,2),xf(1,3),xf(1,4),xf(1,5),xf(0,6),xf(0,7),xf(2,0),xf(3,0),xf(4,0),xf(1,2),xf(0,7,164)];
 return declaration+`<styleSheet xmlns="${NS}"><numFmts count="1"><numFmt numFmtId="164" formatCode="yyyy-mm-dd"/></numFmts><fonts count="${fonts.length}">${fonts.join('')}</fonts><fills count="${fills.length}">${fills.join('')}</fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="${formats.length}">${formats.join('')}</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`;
}
function recordsSheet(headers,rows,meta){
 const title=`<row r="1" ht="36">${cell('GapZer0 Control 자가진단',0,1,1)}</row>`;
 const info=META_FIELDS.map((k,i)=>`<row r="${i+2}" ht="30">${cell(META_LABELS[i],0,i+2,5)}${cell(meta[k]||'',1,i+2,6,['start','end','date'].includes(k))}</row>`).join('');
 const note=`<row r="7" ht="12" customHeight="1">${cell('',0,7,0)}</row>`;
 const header=`<row r="8" ht="32">${headers.map((h,i)=>cell(h,i,8,i<2?1:i<5?2:3)).join('')}</row>`;
 const data=rows.map((values,i)=>`<row r="${i+9}" ht="${height(values,widths)}" customHeight="1">${values.map((v,j)=>cell(v,j,i+9,j<2?5:6,j===7)).join('')}</row>`).join('');
 const last=rows.length+8;
 const validation=(column,options)=>`<dataValidation type="list" allowBlank="1" showErrorMessage="1" errorStyle="stop" errorTitle="목록에서 선택하세요" error="정해진 값 또는 빈칸을 사용하세요." sqref="${column}9:${column}${last}"><formula1>"${options}"</formula1></dataValidation>`;
 return declaration+`<worksheet xmlns="${NS}"><sheetViews><sheetView workbookViewId="0" showGridLines="0" zoomScale="85"><pane xSplit="2" ySplit="8" topLeftCell="C9" activePane="bottomRight" state="frozen"/><selection pane="bottomRight" activeCell="C9" sqref="C9"/></sheetView></sheetViews><sheetFormatPr defaultRowHeight="24"/><cols>${widths.map((w,i)=>`<col min="${i+1}" max="${i+1}" width="${w}" customWidth="1"/>`).join('')}</cols><sheetData>${title}${info}${note}${header}${data}</sheetData><autoFilter ref="A8:I${last}"/><mergeCells count="7"><mergeCell ref="A1:I1"/>${META_FIELDS.map((_,i)=>`<mergeCell ref="B${i+2}:I${i+2}"/>`).join('')}<mergeCell ref="A7:I7"/></mergeCells><dataValidations count="2">${validation('C','충족,부분 충족,미충족,적용 제외')}${validation('I','예정,진행 중,완료')}</dataValidations></worksheet>`;
}
const crcTable=Uint32Array.from({length:256},(_,n)=>{for(let k=0;k<8;k++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
export function crc(bytes){let c=0xffffffff;for(const b of bytes)c=crcTable[(c^b)&255]^(c>>>8);return (c^0xffffffff)>>>0;}
function zip(entries){
 const local=[],central=[];let offset=0,centralSize=0;
 for(const [name,text]of entries){
  const n=enc.encode(name),b=enc.encode(text),checksum=crc(b);
  const h=new Uint8Array(30+n.length),v=new DataView(h.buffer);
  v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint16(6,0x800,true);v.setUint16(12,33,true);v.setUint32(14,checksum,true);v.setUint32(18,b.length,true);v.setUint32(22,b.length,true);v.setUint16(26,n.length,true);h.set(n,30);
  const c=new Uint8Array(46+n.length),d=new DataView(c.buffer);
  d.setUint32(0,0x02014b50,true);d.setUint16(4,20,true);d.setUint16(6,20,true);d.setUint16(8,0x800,true);d.setUint16(14,33,true);d.setUint32(16,checksum,true);d.setUint32(20,b.length,true);d.setUint32(24,b.length,true);d.setUint16(28,n.length,true);d.setUint32(42,offset,true);c.set(n,46);
  local.push(h,b);central.push(c);offset+=h.length+b.length;centralSize+=c.length;
 }
 const end=new Uint8Array(22),e=new DataView(end.buffer);e.setUint32(0,0x06054b50,true);e.setUint16(8,entries.length,true);e.setUint16(10,entries.length,true);e.setUint32(12,centralSize,true);e.setUint32(16,offset,true);
 return new Blob([...local,...central,end],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
}
export function toXlsx(headers,rows,meta={}){
 if(headers.length!==9||!rows.length||rows.some(r=>r.length!==9))throw Error('Excel로 저장할 평가 데이터가 올바르지 않습니다.');
 const relationships=(items)=>declaration+`<Relationships xmlns="${REL}">${items.map(([id,type,target])=>`<Relationship Id="${id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/${type}" Target="${target}"/>`).join('')}</Relationships>`;
 const parts=[['/xl/workbook.xml','sheet.main'],['/xl/worksheets/sheet1.xml','worksheet'],['/xl/styles.xml','styles']];
 return zip([
  ['[Content_Types].xml',declaration+`<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>${parts.map(([name,type])=>`<Override PartName="${name}" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.${type}+xml"/>`).join('')}</Types>`],
  ['_rels/.rels',relationships([['rId1','officeDocument','xl/workbook.xml']])],
  ['xl/workbook.xml',declaration+`<workbook xmlns="${NS}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><bookViews><workbookView/></bookViews><sheets><sheet name="평가 기록" sheetId="1" r:id="rId1"/></sheets></workbook>`],
  ['xl/_rels/workbook.xml.rels',relationships([['rId1','worksheet','worksheets/sheet1.xml'],['rId3','styles','styles.xml']])],
  ['xl/styles.xml',styles()],['xl/worksheets/sheet1.xml',recordsSheet(headers,rows,meta)]
 ]);
}
