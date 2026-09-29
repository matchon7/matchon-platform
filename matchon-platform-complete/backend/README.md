# MATCHON AI OFFICE 운영 API

## 목적
대표가 MATCHON AI OFFICE에서 **업무 확인 → 보고 수신 → 검토 → 승인/반려 → 결과 확인**을 할 수 있도록 Google Apps Script + Google Sheets 기반의 0원 운영 API를 제공합니다.

## 1. 설치
1. https://script.google.com/ 에서 새 프로젝트 생성
2. 저장소의 `Code.gs` 전체를 붙여넣고 저장
3. 왼쪽 **프로젝트 설정 → 스크립트 속성**에서 다음 속성을 추가
   - 속성: `ADMIN_KEY`
   - 값: 대표가 직접 정한 비밀키
4. 함수 `setupMatchon`을 한 번 실행하고 Google 권한을 승인
5. **배포 → 새 배포 → 웹 앱**
6. 실행 사용자: **나**
7. 액세스: 대표가 사용할 계정/범위에 맞게 설정
8. 웹 앱 URL(`/exec`)을 복사

Google Apps Script 웹 앱은 `doGet`/ `doPost`로 HTTP 요청을 처리할 수 있으며, 배포 시 실행 사용자와 접근 권한을 별도로 설정할 수 있습니다. 자세한 공식 안내: https://developers.google.com/apps-script/guides/web

## 2. MATCHON AI OFFICE 연결
`https://matchon.kr/ai-office.html` 접속 후 **연결 설정**에
- Google Apps Script Web App URL
- 대표 API KEY

를 입력하고 **연결 테스트**를 누릅니다.

연결되면 화면이 다음 데이터를 실제 운영DB에서 읽고 씁니다.
- 업무(TASK)
- 대표 보고(REPORT)
- 승인·결재(APPROVAL)
- 감사로그(AUDIT)

## 3. 대표 승인·결재 원칙
다음 항목은 대표의 명시적 승인 전 실행하지 않습니다.
- 비용 집행
- 광고
- 유료 구독/유료 데이터
- 중요 계약
- 수수료/가격 변경
- 독점/장기 약정
- 주요 공식 외부 발송

승인된 비용도 **AI가 결제하지 않습니다. 대표가 직접 결제**하고, 결과와 증빙을 시스템에 기록합니다.

## 4. 데이터 시트
최초 실행 시 다음 시트가 생성됩니다.
- MATCHON_상담관리
- MATCHON_업무
- MATCHON_보고
- MATCHON_승인결재
- MATCHON_감사로그

## 5. 보안 주의
`ADMIN_KEY`는 **GitHub 코드에 입력하지 말고 Script Properties에만 저장**합니다. 운영용 API URL과 키를 공개 저장소나 HTML 소스에 고정하지 않습니다.

## 6. 현재 상태
- 홈페이지: 기존 구조 보존
- AI Office: 대표 업무·보고·승인·결재 화면 보강 완료
- 백엔드 API: 업무/보고/승인/감사로그 기능 코드 반영 완료
- 실제 DB 연결: Apps Script 배포 및 대표 API KEY 설정 후 활성화
- 자동 결제: 금지
