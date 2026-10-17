/**
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

// 시트 첫 행 헤더 자동 설정
function setupSheet(sheet) {
  if (sheet.getLastRow() === 0) {
    // 탭 구성: 번호, 학생이름, 칭찬내용, 칭찬포인트, 일시, 교사메모
    var headers = ['번호', '학생이름', '칭찬내용', '칭찬포인트', '일시', '교사메모'];
    sheet.appendRow(headers);
    
    // 예쁜 핑크빛 헤더 스타일 적용
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#FCE7F3'); // 소프트 핑크
    headerRange.setFontColor('#9D174D'); // 딥 로즈
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');
    sheet.setFrozenRows(1);
    
    // 열 너비 자동 조정
    sheet.setColumnWidth(1, 60);  // 번호
    sheet.setColumnWidth(2, 100); // 학생이름
    sheet.setColumnWidth(3, 220); // 칭찬내용
    sheet.setColumnWidth(4, 90);  // 칭찬포인트
    sheet.setColumnWidth(5, 160); // 일시
    sheet.setColumnWidth(6, 250); // 교사메모
  }
}

// GET 요청 처리 (연동 확인 및 테스트용)
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'ping';
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    action: action,
    message: '매일매일 성장기록 구글 시트 연동이 정상 작동 중입니다!',
    timestamp: new Date().toLocaleString('ko-KR')
  })).setMimeType(ContentService.MimeType.JSON);
}

// POST 요청 처리 (칭찬 기록 추가 및 일괄 동기화)
function doPost(e) {
  var lock = LockService.getScriptLock();
  // 동시 요청 충돌 방지 락 (최대 10초 대기)
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
    
    // 1. 단일 칭찬 기록 추가
    if (action === 'addRecord') {
      var studentNumber = data.studentNumber !== undefined ? data.studentNumber : '';
      var studentName = data.studentName || '';
      var reason = data.reason || '';
      var points = data.points !== undefined ? data.points : 0;
      var timestamp = data.timestamp || new Date().toLocaleString('ko-KR');
      var memo = data.memo || '';
      
      // 행 추가: (번호, 학생이름, 칭찬내용, 칭찬포인트, 일시, 교사메모)
      sheet.appendRow([
        studentNumber,
        studentName,
        reason,
        points,
        timestamp,
        memo
      ]);
      
      // 방금 추가된 행 정렬 (번호 및 포인트 가운데 정렬)
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
    
    // 2. 전체 기록 일괄 동기화 (기존 기록을 시트에 한꺼번에 추가)
    if (action === 'batchSync') {
      var records = data.records || [];
      if (!Array.isArray(records)) {
        return ContentService.createTextOutput(JSON.stringify({
          status: 'error',
          message: 'records 배열 데이터가 올바르지 않습니다.'
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
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
}
