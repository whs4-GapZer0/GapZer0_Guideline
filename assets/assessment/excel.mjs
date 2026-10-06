// A small, write-only XLSX exporter. No macros, formulas, external links or XLSX parser.
// The ZIP entries are stored without compression so no runtime dependency is needed.
const enc=new TextEncoder();
const xml=value=>String(value??'').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffe\uffff]/g,'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const NS='http://schemas.openxmlformats.org/spreadsheetml/2006/main';
const REL='http://schemas.openxmlformats.org/package/2006/relationships';
const declaration='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
const col=i=>String.fromCharCode(65+i); // Assessment has 24 columns (A:X).
const widths=[18,38,30,29,28,72,90,20,66,66,20,46,18,66,24,18,18,18,66,42,18,18,24,18];
function cell(value,i,row,style=0,date=false){
 const text=String(value??'');
 if(text.length>32767)throw Error('Excel 한 셀에 저장할 수 있는 글자 수를 초과했습니다.');
 const ref=col(i)+row;
 if(date&&/^\d{4}-\d{2}-\d{2}$/.test(text)&&!Number.isNaN(Date.parse(text)))return `<c r="${ref}" s="11"><v>${Date.parse(text)/86400000+25569}</v></c>`;
 return `<c r="${ref}" s="${style}" t="inlineStr"><is><t xml:space="preserve">${xml(text)}</t></is></c>`;
}
function height(values,cols){
 let lines=2;
 values.forEach((v,i)=>{const n=String(v??'').split(/\r?\n/).reduce((sum,line)=>sum+Math.max(1,Math.ceil([...line].reduce((w,c)=>w+(c.charCodeAt(0)>255?2:1),0)/(cols[i]-3))),0);lines=Math.max(lines,n);});
 return Math.min(409,lines*16+12);
}
function styles(){
 const fonts=['<font><sz val="11"/><name val="맑은 고딕"/><color rgb="FF243746"/></font>',...['FFFFFF','2563EB','15803D','F59E0B'].map(color=>`<font><b/><sz val="11"/><name val="맑은 고딕"/><color rgb="FF${color}"/></font>`)];
 const fills=['<fill><patternFill patternType="none"/></fill>','<fill><patternFill patternType="gray125"/></fill>',...['203D50','156B71','8B572A','475569','F1F5F9','FFF7E7'].map(color=>`<fill><patternFill patternType="solid"><fgColor rgb="FF${color}"/><bgColor indexed="64"/></patternFill></fill>`)];
 const xf=(font,fill,num=0)=>`<xf numFmtId="${num}" fontId="${font}" fillId="${fill}" borderId="0" xfId="0" applyAlignment="1" applyNumberFormat="1"><alignment vertical="top" wrapText="1"/></xf>`;
 const formats=[xf(0,0),xf(1,2),xf(1,3),xf(1,4),xf(1,5),xf(0,6),xf(0,7),xf(2,0),xf(3,0),xf(4,0),xf(1,2),xf(0,7,164)];
 return declaration+`<styleSheet xmlns="${NS}"><numFmts count="1"><numFmt numFmtId="164" formatCode="yyyy-mm-dd"/></numFmts><fonts count="${fonts.length}">${fonts.join('')}</fonts><fills count="${fills.length}">${fills.join('')}</fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="${formats.length}">${formats.join('')}</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`;
}
function recordsSheet(headers,rows){
 let previous='',group=0;
 const data=rows.map((values,i)=>{
  if(values[0]!==previous){group++;previous=values[0];}
  const cells=values.map((v,j)=>cell(v,j,i+2,j===4?({'Design':7,'Implementation':8,'Operating Effectiveness':9}[v]||0):j<7?(group%2?5:0):6,[15,17,20,21,23].includes(j))).join('');
  return `<row r="${i+2}" ht="${height(values,widths)}" customHeight="1">${cells}</row>`;
 }).join('');
 const last=rows.length+1;
 const validation=(column,options)=>`<dataValidation type="list" allowBlank="1" showErrorMessage="1" errorTitle="목록에서 선택하세요" error="정해진 값 또는 빈칸을 사용하세요." sqref="${column}2:${column}${last}"><formula1>"${options}"</formula1></dataValidation>`;
 return declaration+`<worksheet xmlns="${NS}"><sheetViews><sheetView workbookViewId="0" showGridLines="0" zoomScale="85"><pane xSplit="1" ySplit="1" topLeftCell="B2" activePane="bottomRight" state="frozen"/><selection pane="bottomRight" activeCell="H2" sqref="H2"/></sheetView></sheetViews><sheetFormatPr defaultRowHeight="24"/><cols>${widths.map((w,i)=>`<col min="${i+1}" max="${i+1}" width="${w}" customWidth="1"/>`).join('')}</cols><sheetData><row r="1" ht="48" customHeight="1">${headers.map((h,i)=>cell(h,i,1,i<7?1:i<12?2:i<19?3:4)).join('')}</row>${data}</sheetData><autoFilter ref="A1:X${last}"/><dataValidations count="3">${validation('H','충족,부분 충족,미충족,확인 필요,적용 제외')}${validation('K','예,아니오')}${validation('Q','예정,진행 중,완료')}</dataValidations></worksheet>`;
}
function guidanceSheet(){
 const lines=[
 ['GapZer0 자가진단 템플릿',''],
 ['작성 방법','평가 기록 시트에서 질문별 현재 상태와 필요한 개선계획을 작성합니다.'],
 ['색상 구분','회색·흰색 영역은 기준 정보, 연한 노란색 영역은 작성 항목입니다. 평가 관점은 글자 색으로 구분합니다.'],
 ['필터와 고정 행','첫 행의 필터로 Domain·Control·평가 관점을 선택합니다. 제목행과 Control ID 열은 스크롤해도 유지됩니다.'],
 ['기준 정보 (A:G)','Control ID, Control Name, Security Domain, Question ID, 평가 관점, Assessment Question, Evidence는 변경하지 않습니다.'],
 ['평가 기록 (H:L)','담당자 응답, 평가 근거, 확인한 증적을 기록합니다. 미충족·확인 필요에서 자료가 없으면 확인한 증적 없음을 선택합니다.'],
 ['개선조치 (M:S)','부분 충족·미충족은 개선계획, 확인 필요는 추가 확인 계획을 작성합니다. 담당자·기한·진행 상태와 완료 후 결과를 기록합니다. 조치 유형은 사이트에서 응답에 따라 다시 정해집니다.'],
 ['평가 기본정보 (T:X)','평가 범위·평가기간·담당자·평가일을 기록합니다. 같은 평가에 속한 행은 동일하게 작성합니다.'],
 ['선택 가능한 응답','충족 / 부분 충족 / 미충족 / 확인 필요 / 적용 제외'],
 ['날짜 입력','날짜는 YYYY-MM-DD 형식을 사용합니다. 예: 2026-10-06'],
 ['사이트로 다시 불러오기','Excel에서 평가 기록 시트를 선택한 뒤 CSV UTF-8(쉼표로 분리)로 저장합니다. 사이트의 작성 내용 CSV 불러오기로 선택하고 교체 내용을 확인합니다. XLSX 직접 불러오기는 지원하지 않습니다.'],
 ['기존 기록 교체','CSV 불러오기를 확정하면 현재 브라우저의 평가 전체가 파일 내용으로 교체됩니다. 먼저 기존 작성 내용 CSV를 보관하세요.'],
 ['긴 내용 확인','줄바꿈으로 전체 내용을 저장합니다. 매우 긴 셀은 Excel 행 높이 제한으로 일부가 가려질 수 있으므로 셀을 선택해 수식 입력줄에서 확인하세요.'],
 ['로컬 처리','사이트의 저장·파일 불러오기·다운로드는 사용자 브라우저에서 처리하며 작성 내용을 서버로 전송하지 않습니다.'],
 ['CSV 텍스트 표시','CSV에서 수식 오인을 막기 위해 붙인 [텍스트] 접두어는 다시 불러올 때도 유지합니다.'],
 ];
 return declaration+`<worksheet xmlns="${NS}"><sheetViews><sheetView workbookViewId="0" showGridLines="0"/></sheetViews><cols><col min="1" max="1" width="30" customWidth="1"/><col min="2" max="2" width="110" customWidth="1"/></cols><sheetData>${lines.map((v,i)=>`<row r="${i+1}" ht="${i===0?38:height(v,[30,110])}" customHeight="1">${cell(v[0],0,i+1,i===0?10:5)}${cell(v[1],1,i+1,0)}</row>`).join('')}</sheetData><mergeCells count="1"><mergeCell ref="A1:B1"/></mergeCells></worksheet>`;
}
const crcTable=Uint32Array.from({length:256},(_,n)=>{for(let k=0;k<8;k++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
function crc(bytes){let c=0xffffffff;for(const b of bytes)c=crcTable[(c^b)&255]^(c>>>8);return (c^0xffffffff)>>>0;}
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
export function toXlsx(headers,rows){
 if(headers.length!==24||!rows.length||rows.some(r=>r.length!==24))throw Error('Excel로 저장할 평가 데이터가 올바르지 않습니다.');
 const relationships=(items)=>declaration+`<Relationships xmlns="${REL}">${items.map(([id,type,target])=>`<Relationship Id="${id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/${type}" Target="${target}"/>`).join('')}</Relationships>`;
 const parts=[['/xl/workbook.xml','sheet.main'],['/xl/worksheets/sheet1.xml','worksheet'],['/xl/worksheets/sheet2.xml','worksheet'],['/xl/styles.xml','styles']];
 return zip([
  ['[Content_Types].xml',declaration+`<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>${parts.map(([name,type])=>`<Override PartName="${name}" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.${type}+xml"/>`).join('')}</Types>`],
  ['_rels/.rels',relationships([['rId1','officeDocument','xl/workbook.xml']])],
  ['xl/workbook.xml',declaration+`<workbook xmlns="${NS}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><bookViews><workbookView/></bookViews><sheets><sheet name="평가 기록" sheetId="1" r:id="rId1"/><sheet name="작성 안내" sheetId="2" r:id="rId2"/></sheets></workbook>`],
  ['xl/_rels/workbook.xml.rels',relationships([['rId1','worksheet','worksheets/sheet1.xml'],['rId2','worksheet','worksheets/sheet2.xml'],['rId3','styles','styles.xml']])],
  ['xl/styles.xml',styles()],['xl/worksheets/sheet1.xml',recordsSheet(headers,rows)],['xl/worksheets/sheet2.xml',guidanceSheet()]
 ]);
}
