const FOLDER_NAME="MATCHON_상담";
const SHEET_NAME="MATCHON_상담관리";
const OPS_SHEET="MATCHON_업무";
const REPORT_SHEET="MATCHON_보고";
const APPROVAL_SHEET="MATCHON_승인결재";
const AUDIT_SHEET="MATCHON_감사로그";

function folder_(){
  const f=DriveApp.getFoldersByName(FOLDER_NAME);
  return f.hasNext()?f.next():DriveApp.createFolder(FOLDER_NAME);
}
function ss_(){
  const p=PropertiesService.getScriptProperties(),id=p.getProperty("SHEET_ID");
  if(id){try{return SpreadsheetApp.openById(id)}catch(e){}}
  const s=SpreadsheetApp.create(SHEET_NAME);p.setProperty("SHEET_ID",s.getId());return s;
}
function sheet_(name,headers){
  const s=ss_(),sh=s.getSheetByName(name)||s.insertSheet(name);
  if(sh.getLastRow()===0)sh.appendRow(headers);
  return sh;
}
function setupMatchon(){
  sheet_(SHEET_NAME,["접수일시","유형","브랜드","성명","연락처","희망지역","예산","매장유형","문의내용","원본JSON"]);
  sheet_(OPS_SHEET,["ID","생성일시","우선순위","업무","담당","상태","기한","결과","근거","다음조치","수정일시"]);
  sheet_(REPORT_SHEET,["ID","작성일시","기간","보고유형","요약","상세","KPI","문제","다음조치","상태","확인일시"]);
  sheet_(APPROVAL_SHEET,["ID","요청일시","요청유형","제목","요청내용","금액","지출필요","무료대안","요청자","상태","대표의견","처리일시","증빙"]);
  sheet_(AUDIT_SHEET,["일시","행위","대상ID","처리자","내용"]);
  return {ok:true,spreadsheetId:ss_().getId()};
}
function json_(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON)}
function id_(p){return p+"-"+Utilities.getUuid().slice(0,8).toUpperCase()}
function now_(){return Utilities.formatDate(new Date(),Session.getScriptTimeZone()||"Asia/Seoul","yyyy-MM-dd HH:mm:ss")}
function auth_(d){
  const key=PropertiesService.getScriptProperties().getProperty("ADMIN_KEY");
  return !!key && String(d.key||"")===key;
}
function audit_(action,target,actor,content){sheet_(AUDIT_SHEET,["일시","행위","대상ID","처리자","내용"]).appendRow([now_(),action,target,actor||"대표",content||""])}
function rows_(sh){
  const v=sh.getDataRange().getValues();if(v.length<2)return[];
  const h=v[0];return v.slice(1).filter(r=>r.join("")!=="").map(r=>{const o={};h.forEach((k,i)=>o[k]=r[i]);return o});
}
function doGet(e){
  const d=e&&e.parameter||{};
  if(d.health==="1")return json_({ok:true,service:"MATCHON AI OFFICE API",time:now_()});
  if(!auth_(d))return json_({ok:false,error:"AUTH_REQUIRED"});
  setupMatchon();
  const action=d.action||"dashboard";
  const out={ok:true,time:now_()};
  if(action==="dashboard"){
    out.tasks=rows_(sheet_(OPS_SHEET,["ID","생성일시","우선순위","업무","담당","상태","기한","결과","근거","다음조치","수정일시"])).slice(-100).reverse();
    out.reports=rows_(sheet_(REPORT_SHEET,["ID","작성일시","기간","보고유형","요약","상세","KPI","문제","다음조치","상태","확인일시"])).slice(-50).reverse();
    out.approvals=rows_(sheet_(APPROVAL_SHEET,["ID","요청일시","요청유형","제목","요청내용","금액","지출필요","무료대안","요청자","상태","대표의견","처리일시","증빙"])).slice(-50).reverse();
    return json_(out);
  }
  return json_({ok:false,error:"UNKNOWN_ACTION"});
}
function doPost(e){
  try{
    const d=JSON.parse(e.parameter.payload||"{}");
    if(!auth_(d))return json_({ok:false,error:"AUTH_REQUIRED"});
    setupMatchon();
    const action=d.action||"";
    if(action==="task_create"){
      const id=id_("TASK"),sh=sheet_(OPS_SHEET,["ID","생성일시","우선순위","업무","담당","상태","기한","결과","근거","다음조치","수정일시"]);
      sh.appendRow([id,now_(),d.priority||"P1",d.title||"",d.owner||"AI",d.status||"대기",d.due||"",d.result||"",d.evidence||"",d.next||"",now_()]);
      audit_("TASK_CREATE",id,d.actor||"대표",d.title||"");return json_({ok:true,id});
    }
    if(action==="report_create"){
      const id=id_("REPORT"),sh=sheet_(REPORT_SHEET,["ID","작성일시","기간","보고유형","요약","상세","KPI","문제","다음조치","상태","확인일시"]);
      sh.appendRow([id,now_(),d.period||"",d.type||"일일보고",d.summary||"",d.detail||"",d.kpi||"",d.issues||"",d.next||"", "미확인",""]);
      audit_("REPORT_CREATE",id,d.actor||"AI CEO",d.summary||"");return json_({ok:true,id});
    }
    if(action==="approval_create"){
      const id=id_("APPROVAL"),sh=sheet_(APPROVAL_SHEET,["ID","요청일시","요청유형","제목","요청내용","금액","지출필요","무료대안","요청자","상태","대표의견","처리일시","증빙"]);
      sh.appendRow([id,now_(),d.type||"일반승인",d.title||"",d.detail||"",d.amount||0,d.expense||"아니오",d.alternative||"",d.requester||"AI", "승인대기","", "", d.proof||""]);
      audit_("APPROVAL_REQUEST",id,d.requester||"AI",d.title||"");return json_({ok:true,id});
    }
    if(action==="approval_decide"){
      const sh=sheet_(APPROVAL_SHEET,["ID","요청일시","요청유형","제목","요청내용","금액","지출필요","무료대안","요청자","상태","대표의견","처리일시","증빙"]);
      const data=sh.getDataRange().getValues(),id=String(d.id||"");let found=false;
      for(let i=1;i<data.length;i++)if(String(data[i][0])===id){data[i][9]=d.decision==="approve"?"대표승인":"대표반려";data[i][10]=d.comment||"";data[i][11]=now_();sh.getRange(i+1,1,1,data[i].length).setValues([data[i]]);found=true;break}
      if(!found)return json_({ok:false,error:"NOT_FOUND"});
      audit_(d.decision==="approve"?"APPROVAL_APPROVE":"APPROVAL_REJECT",id,d.actor||"대표",d.comment||"");
      return json_({ok:true,id,status:d.decision==="approve"?"대표승인":"대표반려"});
    }
    if(action==="report_ack"){
      const sh=sheet_(REPORT_SHEET,["ID","작성일시","기간","보고유형","요약","상세","KPI","문제","다음조치","상태","확인일시"]);
      const data=sh.getDataRange().getValues(),id=String(d.id||"");let found=false;
      for(let i=1;i<data.length;i++)if(String(data[i][0])===id){data[i][9]="대표확인";data[i][10]=now_();sh.getRange(i+1,1,1,data[i].length).setValues([data[i]]);found=true;break}
      if(!found)return json_({ok:false,error:"NOT_FOUND"});
      audit_("REPORT_ACK",id,d.actor||"대표","보고 확인");return json_({ok:true,id,status:"대표확인"});
    }
    if(action==="task_update"){
      const sh=sheet_(OPS_SHEET,["ID","생성일시","우선순위","업무","담당","상태","기한","결과","근거","다음조치","수정일시"]);
      const data=sh.getDataRange().getValues(),id=String(d.id||"");let found=false;
      for(let i=1;i<data.length;i++)if(String(data[i][0])===id){if(d.status!==undefined)data[i][5]=d.status;if(d.result!==undefined)data[i][7]=d.result;if(d.evidence!==undefined)data[i][8]=d.evidence;if(d.next!==undefined)data[i][9]=d.next;data[i][10]=now_();sh.getRange(i+1,1,1,data[i].length).setValues([data[i]]);found=true;break}
      if(!found)return json_({ok:false,error:"NOT_FOUND"});
      audit_("TASK_UPDATE",id,d.actor||"AI",d.status||"");return json_({ok:true,id});
    }
    return json_({ok:false,error:"UNKNOWN_ACTION"});
  }catch(err){return json_({ok:false,error:String(err)})}
}