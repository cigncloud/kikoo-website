# 키쿠 웹사이트

앱스토어의 마케팅 URL, 고객지원 URL, 개인정보 처리방침 URL로 사용하는 정적 사이트입니다. 한국어를 기본 언어로 제공하며 영어와 일본어 번역을 함께 제공합니다. GitHub Pages는 생성된 HTML을 그대로 제공하므로 배포 서버에 Node.js나 별도 빌드 설정이 필요하지 않습니다.

## 공개 링크

| App Store Connect 항목 | URL |
| --- | --- |
| 마케팅 URL | https://cigncloud.github.io/kikoo-website/ |
| 지원 URL | https://cigncloud.github.io/kikoo-website/support.html |
| 개인정보 처리방침 URL | https://cigncloud.github.io/kikoo-website/privacy.html |
| 서비스 이용약관 | https://cigncloud.github.io/kikoo-website/terms.html |

문의처: 인스타그램 [@kikioo_selfie_club](https://www.instagram.com/kikioo_selfie_club/) DM. 기존 공개 운영자 표시인 Cigncloud를 유지합니다.

## 편집·미리보기

```sh
# 문구: locales/ko.json, locales/en.json, locales/ja.json
# 디자인: styles.css
# 운영자·공개 URL·언어 목록: site.config.mjs
node scripts/build.mjs
python3 -m http.server 4173 --bind 127.0.0.1
```

`http://127.0.0.1:4173/`에서 확인합니다. 빌드는 Node.js 내장 모듈만 사용하며 의존성 설치가 없습니다. 생성된 `index.html`, `privacy.html`, `support.html`, `terms.html`, `robots.txt`, `sitemap.xml`을 함께 커밋해야 합니다. 생성된 HTML에 문구를 직접 수정하면 다음 빌드 때 덮어쓰므로 원본 JSON을 수정하세요.

FAQ는 브라우저 기본 `details`/`summary`를 사용합니다. JavaScript, 외부 폰트 요청, 광고·분석 스크립트, 서버 전송 폼은 없습니다. 문의 버튼은 인스타그램 `@kikioo_selfie_club` 프로필로 연결하며, 사용자가 직접 DM을 보냅니다. 화면 확대는 별도 스크린샷 이미지 링크입니다.

## 다국어 추가

1. `locales/ko.json`을 복사하여 `locales/en.json`, `locales/ja.json`, `locales/zh-Hans.json` 등으로 번역합니다. 제목·설명·버튼·접근성 이름·이미지 설명·지원·약관·개인정보 처리방침을 모두 번역합니다. 법적 문구도 검토합니다.
2. `site.config.mjs`의 `locales`에 언어를 추가합니다. 예:

   ```js
   { code: 'en', lang: 'en', ogLocale: 'en_US', label: 'English', path: 'en/', appStoreUrl: 'https://apps.apple.com/us/app/id6830932635' },
   { code: 'ja', lang: 'ja', ogLocale: 'ja_JP', label: '日本語', path: 'ja/', appStoreUrl: 'https://apps.apple.com/jp/app/id6830932635' },
   { code: 'zh-Hans', lang: 'zh-Hans', ogLocale: 'zh_CN', label: '简体中文', path: 'zh-Hans/', appStoreUrl: 'https://apps.apple.com/cn/app/id6830932635' },
   ```

3. `node scripts/build.mjs`를 실행합니다. 번역 키가 누락되거나 목록 길이가 원본과 다르면 빌드가 실패합니다. 각 언어의 네 페이지와 상대 경로, 언어 전환 링크, self-canonical, 상호 `hreflang`, sitemap이 생성됩니다.
4. 번역한 스크린샷이 있으면 언어 항목의 `screenshots`에 다섯 이미지 이름을 지정할 수 있습니다. 각 이름에 대해 `assets/screenshots/{이름}-480.webp`, `{이름}-720.webp`를 준비합니다. 지정하지 않으면 기존 앱스토어 한국어 스크린샷을 사용합니다.
5. 새 언어 URL의 HTTP 200, 링크와 레이아웃을 확인하고 공개합니다. 준비 중인 언어를 목록에 먼저 넣지 마세요.

한국어 기본 페이지는 기존 App Store Connect 주소와 호환되는 루트(`/`)에 유지합니다. 영어는 `/en/`, 일본어는 `/ja/`에서 제공하며 브라우저 언어로 강제 이동하지 않습니다. 홈 페이지에는 언어별 App Store 링크와 접근 가능한 App Store 배지를 표시합니다. 한국어 링크는 한국 App Store 주소를 사용하고, 영어와 일본어 링크는 각 스토어 지역의 앱 페이지를 사용합니다.

## 사진·개인정보 문구 유지 원칙

사용자 이미지·사진·영상·미디어 특징을 회사 또는 처리업체 클라우드로 보내지 않는다는 약속을 명시합니다. 사용자가 선택한 외부 공유와 iCloud 사진은 회사 클라우드 수집과 구분합니다. 사진 백업·서버 복구를 약속하지 않습니다.

계정·Apple 거래·코인 지급/사용·이용권·보상 요약, GA4 기본 사용 통계·기술 정보, 고객지원 문의 정보는 사실에 맞게 고지합니다. 사진 미수집을 ‘모든 데이터 미수집’으로 표현하지 않습니다. 현재 앱의 이용정보 화면은 안내용이므로 지원하지 않는 수집 해제 스위치나 사전 동의 UI를 약속하지 않습니다. 계정 식별자가 통계와 연결될 수 있어 통계를 무조건 익명이라고 표현하지 않습니다.

개인정보 처리방침 및 약관 변경 시 `site.config.mjs`의 날짜와 해당 언어의 시행일 문구를 함께 갱신합니다. 운영 법인·처리업체·처리 지역·보유기간·동의 방식에 변경이 있으면 실제 운영 설정과 적용 국가의 고지 의무를 확인하고 반영하세요.

## 디자인과 자산

크림색 종이 바탕, 핑크색 강조, 손글씨 제목, 스티커 사진 콜라주를 사용합니다. 원본 이미지의 내용은 변경하지 않고 WebP로 리사이즈했습니다. 이미지의 원본 경로는 [자산 출처](assets/README.md)에 기록합니다. 헤딩 폰트 Single Day는 로컬 제공하며 OFL 라이선스를 함께 보관합니다.

## 배포

저장소: `cigncloud/kikoo-website`. GitHub Pages의 `main` / `/(root)` 배포를 사용합니다. `main`에 반영한 뒤 Pages 배포 성공과 공개 URL을 확인하세요. 모노레포에서는 `website/`가 별도 Git 서브모듈입니다.

검색 설정으로 canonical, 실제 제공하는 언어만 포함한 hreflang, 절대 경로 OG 이미지, robots.txt, sitemap.xml, JSON-LD 구조화 데이터를 제공합니다. Google Search Console의 URL-prefix 속성은 `https://cigncloud.github.io/kikoo-website/`, 제출할 sitemap은 `https://cigncloud.github.io/kikoo-website/sitemap.xml`입니다. Search Console 소유권 등록은 별도 작업입니다.
