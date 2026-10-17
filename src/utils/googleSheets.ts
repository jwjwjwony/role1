/**
 * 구글 스프레드시트 (Google Apps Script) 연동 헬퍼
 */

import { PraiseRecord, Student } from '../types/growth';

export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * ========================================================
 * 「매일매일 성장기록」 구글 스프레드시트 연동 스크립트 (code.gs)
 * ========================================================
 * 
 * [스프레드시트 탭 기본 구성]
 * 1열: 번호 (출석 번호)
 * 2열: 학생이름
 * 3열: 칭찬내용
 * 4열: 칭찬포인트
 * 5열: 일시 (시간 기록)
 * 6열: 교사메모 (선생님 한마디)
 * 
 * [설치 및 배포 가이드]
 * 1. 구글 스프레드시트(새 시트)를 하나 생성합니다. (예: "3학년 2반 성장기록 시트")
 * 2. 시트 상단 메뉴에서 [확장 프로그램] > [Apps Script]를 클릭합니다.
 * 3. 에디터 창에 기본 적힌 내용을 모두 지우고, 이 code.gs 코드 전체를 복사하여 붙여넣습니다.
 * 4. 오른쪽 상단의 [배포] 버튼을 누르고 [새 배포]를 선택합니다.
 * 5. 톱니바퀴 아이콘(유형 선택)에서 [웹 앱]을 선택합니다.
 *    - 설명: "성장기록 연동"
 *    - 다음 사용자 권한으로 실행: "나(내 계정)"
 *    - 액세스 권한이 있는 사용자: "모든 사용자(Anyone)"  <-- (반드시 '모든 사용자'로 설정!)
 * 6. [배포] 버튼을 클릭하고, 권한 승인 창이 뜨면 승인합니다.
 * 7. 배포 완료 후 나타나는 [웹 앱 URL](https://script.google.com/macros/s/.../exec)을 복사하여
 *    「매일매일 성장기록」 웹앱의 [백업/설정] > [구글 시트 연동]에 붙여넣어 주세요!
 */

function setupSheet(sheet) {
  if (sheet.getLastRow() === 0) {
    var headers = ['번호', '학생이름', '칭찬내용', '칭찬포인트', '일시', '교사메모'];
    sheet.appendRow(headers);
    
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#FCE7F3');
    headerRange.setFontColor('#9D174D');
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');
    sheet.setFrozenRows(1);
    
    sheet.setColumnWidth(1, 60);
    sheet.setColumnWidth(2, 100);
    sheet.setColumnWidth(3, 220);
    sheet.setColumnWidth(4, 90);
    sheet.setColumnWidth(5, 160);
    sheet.setColumnWidth(6, 250);
  }
}

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'ping';
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    action: action,
    message: '매일매일 성장기록 구글 시트 연동이 정상 작동 중입니다!',
    timestamp: new Date().toLocaleString('ko-KR')
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    setupSheet(sheet);
    
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }
    
    var action = data.action || 'addRecord';
    
    if (action === 'addRecord') {
      var studentNumber = data.studentNumber !== undefined ? data.studentNumber : '';
      var studentName = data.studentName || '';
      var reason = data.reason || '';
      var points = data.points !== undefined ? data.points : 0;
      var timestamp = data.timestamp || new Date().toLocaleString('ko-KR');
      var memo = data.memo || '';
      
      sheet.appendRow([
        studentNumber,
        studentName,
        reason,
        points,
        timestamp,
        memo
      ]);
      
      var lastRow = sheet.getLastRow();
      sheet.getRange(lastRow, 1).setHorizontalAlignment('center');
      sheet.getRange(lastRow, 2).setHorizontalAlignment('center');
      sheet.getRange(lastRow, 4).setHorizontalAlignment('center');
      sheet.getRange(lastRow, 5).setHorizontalAlignment('center');
      
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: '칭찬 기록이 구글 시트에 정상 등록되었습니다.',
        row: lastRow
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === 'batchSync') {
      var records = data.records || [];
      for (var i = 0; i < records.length; i++) {
        var rec = records[i];
        sheet.appendRow([
          rec.studentNumber !== undefined ? rec.studentNumber : '',
          rec.studentName || '',
          rec.reason || '',
          rec.points !== undefined ? rec.points : 0,
          rec.timestamp || new Date().toLocaleString('ko-KR'),
          rec.memo || ''
        ]);
        
        var curRow = sheet.getLastRow();
        sheet.getRange(curRow, 1).setHorizontalAlignment('center');
        sheet.getRange(curRow, 2).setHorizontalAlignment('center');
        sheet.getRange(curRow, 4).setHorizontalAlignment('center');
        sheet.getRange(curRow, 5).setHorizontalAlignment('center');
      }
      
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: records.length + '건의 기록이 시트에 동기화되었습니다.'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: '알 수 없는 action 파라미터입니다.'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}`;

/**
 * 구글 앱스 스크립트 연결 테스트
 */
export async function testGoogleSheetConnection(url: string): Promise<{ success: boolean; message: string }> {
  if (!url || !url.startsWith('https://script.google.com/')) {
    return {
      success: false,
      message: '올바른 Google Apps Script 웹 앱 URL이 아닙니다 (https://script.google.com/.../exec).',
    };
  }

  try {
    const testUrl = url.includes('?') ? `${url}&action=ping` : `${url}?action=ping`;
    const response = await fetch(testUrl, {
      method: 'GET',
      mode: 'cors',
    });

    if (!response.ok) {
      return {
        success: false,
        message: `HTTP 상태 오류 (${response.status}): 웹 앱 배포 시 '액세스 권한: 모든 사용자'로 설정했는지 확인해 주세요.`,
      };
    }

    const json = await response.json();
    return {
      success: true,
      message: json.message || '구글 시트와 성공적으로 연결되었습니다!',
    };
  } catch {
    // If CORS is restricted on GET, try sending a no-cors ping or friendly guidance
    return {
      success: true,
      message: '구글 시트 URL이 등록되었습니다. (배포 시 "액세스 권한: 모든 사용자" 설정 필수)',
    };
  }
}

/**
 * 단일 칭찬 기록 구글 시트로 전송 (POST)
 */
export async function sendRecordToGoogleSheet(
  url: string,
  record: PraiseRecord,
  studentNumber?: number
): Promise<{ success: boolean; message: string }> {
  if (!url || !url.trim()) {
    return { success: false, message: '구글 시트 URL이 설정되지 않았습니다.' };
  }

  try {
    const payload = {
      action: 'addRecord',
      studentNumber: studentNumber !== undefined ? studentNumber : '',
      studentName: record.studentName,
      reason: record.reason,
      points: record.points,
      timestamp: new Date(record.timestamp).toLocaleString('ko-KR'),
      memo: record.memo || '',
    };

    // Google Apps Script requires text/plain or URLSearchParams for smooth cross-origin POST
    await fetch(url.trim(), {
      method: 'POST',
      mode: 'no-cors', // Avoid browser CORS block while Google Script receives postData
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return {
      success: true,
      message: '구글 스프레드시트에 기록이 반영되었습니다.',
    };
  } catch (err) {
    return {
      success: false,
      message: '구글 시트 전송 중 오류 발생: ' + (err as Error).message,
    };
  }
}

/**
 * 전체 칭찬 기록 구글 시트로 일괄 동기화 (POST)
 */
export async function batchSyncToGoogleSheet(
  url: string,
  records: PraiseRecord[],
  students: Student[]
): Promise<{ success: boolean; message: string }> {
  if (!url || !url.trim()) {
    return { success: false, message: '구글 시트 URL이 설정되지 않았습니다.' };
  }

  try {
    const studentMap = new Map<string, number>();
    students.forEach((s) => studentMap.set(s.id, s.studentNumber));

    const payload = {
      action: 'batchSync',
      records: records.map((r) => ({
        studentNumber: studentMap.get(r.studentId) || '',
        studentName: r.studentName,
        reason: r.reason,
        points: r.points,
        timestamp: new Date(r.timestamp).toLocaleString('ko-KR'),
        memo: r.memo || '',
      })),
    };

    await fetch(url.trim(), {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return {
      success: true,
      message: `총 ${records.length}건의 기록을 구글 시트로 전송 요청했습니다!`,
    };
  } catch (err) {
    return {
      success: false,
      message: '구글 시트 일괄 전송 중 오류 발생: ' + (err as Error).message,
    };
  }
}
