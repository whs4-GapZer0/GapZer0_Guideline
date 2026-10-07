# 외부 테마와 jQuery 관리

## 고정한 버전

- Jekyll GitBook: `sighingnow/jekyll-gitbook@a7d876936fe650c46eaf9eca92dc7afe0f1e1f17`
- jQuery: `3.7.1` (3.x 계열). 기존 GitBook 플러그인과의 호환성을 유지하면서 3.1.1의 알려진 보안 문제를 해소합니다.
- jQuery 공식 원본: https://code.jquery.com/jquery-3.7.1.min.js
- jQuery SHA-256: `fc9a93dd241f6b045cbff0481cf4e1901becd0e12fb45166a8f17f95823f0b1a`

## 로컬 파일을 둔 이유

원본 `gitbook.js`와 `theme.js`는 각각 jQuery 3.1.1을 포함합니다. 두 번들의 Browserify 모듈 1을 `t.exports=window.jQuery;`로 대체했습니다. `_includes/footer.html`에서 로컬 jQuery를 먼저 로드하므로 두 번들과 검색·목차 플러그인은 같은 jQuery 객체를 사용합니다. 나머지 번들 코드는 유지합니다.

변경 파일은 `assets/gitbook/gitbook.js`, `assets/gitbook/theme.js`입니다. 원본 테마의 라이선스는 `assets/gitbook/theme-LICENSE.txt`, jQuery 라이선스는 `assets/vendor/jquery-LICENSE.txt`에 보관합니다.

원본 번들의 SHA-256:

- gitbook.js: `0120a1d8b5c8da67a20c7fb484020edde2be75a79b252dbd1a72ddb1578432df`
- theme.js: `ca536a3e11cff9890fae42c054a0b5c0bcfcbaa496501527e1e229d2c446d291`

`assets/gitbook/gitbook-plugin-search-pro/search.js`도 같은 테마 커밋에서 가져와 수정했습니다. 잘못된 URL 인코딩을 처리하고 검색어는 200자까지 처리합니다. 검색 결과는 DOM 텍스트 노드로 만들며 강조 부분만 별도 span으로 표시합니다.

## 업데이트 시 확인할 사항

테마 버전만 변경하면 위의 로컬 파일은 자동 갱신되지 않습니다. 원본 변경분을 비교하고, 번들에 오래된 jQuery가 다시 포함되지 않았는지 확인해야 합니다. jQuery는 공식 배포 파일의 해시와 라이선스를 확인하고 교체합니다. 파일명을 바꾸면 footer의 경로와 테스트의 예상 버전도 함께 갱신합니다.

브라우저 검증: `THEME_TEST_ROOT`를 Jekyll 빌드 출력 폴더로 지정하고 `node tests/control-site-browser.mjs`를 실행합니다. 기존 CI의 같은 명령에서도 보안 검증이 함께 실행됩니다. 목차 이동, 모바일 상세 설명, 야간 모드, 검색, 자가진단 저장 및 Excel 왕복을 확인합니다.

## Excel 입력 제한

원본 25MiB·압축 해제 합계 50MiB 제한에 더해 XML 파일당 8MiB, 공유 문자열 XML 2MiB, XML 시작 요소 50,000개, 공유 문자열 5,000개를 허용합니다. 문서 크기·요소 수는 DOM 생성 전에 검사합니다. 제한을 넘는 파일은 적용 전에 거부하며 현재 평가 기록을 유지합니다. 복잡한 서식이 많은 파일이 거부되면 새 템플릿에 값만 옮겨 저장합니다.

이번 변경은 Oracle Nginx 설정이나 GitHub 브랜치 보호·배포 권한을 변경하지 않습니다.
