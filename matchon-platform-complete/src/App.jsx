import React, { useState } from "react";
import ByeolGuksu from "./pages/ByeolGuksu";

/* =========================================================
   MATCHON
   Franchise & Partnership Platform
   ========================================================= */

const CONSULTATION_ENDPOINT = "";
const EMAIL = "matchon7@daum.net";

/*
  GitHub Pages /matchon-platform/ 환경에서도
  링크가 깨지지 않도록 Vite BASE_URL을 사용합니다.
*/
const BASE_URL = import.meta.env.BASE_URL || "/";

const BYEOL_GUKSU_URL = `${BASE_URL}byeolguksu/`;

const brands = [
  {
    no: "01",
    name: "별국수",
    en: "BYEOL GUKSU",
    desc: "K-누들 중심의 유연한 외식 프랜차이즈",
    link: BYEOL_GUKSU_URL,
    featured: true,
  },
  {
    no: "02",
    name: "별스트리트",
    en: "BYEOL STREET",
    desc: "국수와 한국식 스트리트푸드 복합 모델",
    link: `${BYEOL_GUKSU_URL}#brands`,
  },
  {
    no: "03",
    name: "별그릴",
    en: "BYEOL GRILL",
    desc: "한국식 BBQ·식사·모임형 외식 모델",
    link: `${BYEOL_GUKSU_URL}#brands`,
  },
  {
    no: "04",
    name: "그로타피맥",
    en: "GROTTA PIMAC",
    desc: "피자·맥주를 기반으로 확장하는 외식 브랜드",
    link: "#contact",
  },
];

/* =========================================================
   공통 섹션 이동
   ========================================================= */

function scrollToSection(id) {
  const target = document.getElementById(id);

  if (!target) return;

  target.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

/* =========================================================
   HOME
   ========================================================= */

function Home() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  /* -------------------------------------------------------
     모바일 메뉴 닫기
     ------------------------------------------------------- */

  function closeMenu() {
    setOpen(false);
  }

  /* -------------------------------------------------------
     상담 신청
     ------------------------------------------------------- */

  async function submit(e) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (!data.name || !data.phone || !data.region) {
      alert("성명/업체명, 연락처, 희망 출점지역을 입력해주세요.");
      return;
    }

    if (!data.privacy) {
      alert("개인정보 수집·이용에 동의해주세요.");
      return;
    }

    setSending(true);
    setSent(false);

    const payload = {
      type: "MATCHON_MAIN",
      submittedAt: new Date().toISOString(),
      ...data,
    };

    try {
      /*
        실제 상담 접수 서버가 연결되어 있으면
        CONSULTATION_ENDPOINT에 주소를 넣습니다.
      */
      if (CONSULTATION_ENDPOINT) {
        await fetch(CONSULTATION_ENDPOINT, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: new URLSearchParams({
            payload: JSON.stringify(payload),
          }),
        });
      } else {
        /*
          현재는 서버가 연결되어 있지 않으므로
          브라우저에 마지막 상담 내용을 임시 저장합니다.
        */
        localStorage.setItem(
          "matchon_last_inquiry",
          JSON.stringify(payload)
        );
      }

      form.reset();
      setSent(true);
    } catch (error) {
      console.error("MATCHON consultation error:", error);

      alert(
        "상담 신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
    } finally {
      setSending(false);
    }
  }

  /* -------------------------------------------------------
     네비게이션
     ------------------------------------------------------- */

  function handleSectionNavigation(e, id) {
    e.preventDefault();
    scrollToSection(id);
    closeMenu();
  }

  return (
    <div className="matchon">

      {/* ===================================================
          HEADER
          =================================================== */}

      <header className="site-header">
        <div className="header-inner">

          <a
            href={BASE_URL}
            className="logo"
            aria-label="매치온 홈페이지"
            onClick={closeMenu}
          >
            <span className="logo-mark">
              M
            </span>

            <span className="logo-text">
              <strong>매치온</strong>
              <small>MATCHON</small>
            </span>
          </a>

          <button
            type="button"
            className="hamb"
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? "×" : "☰"}
          </button>

          <nav
            className={open ? "nav open" : "nav"}
            aria-label="주요 메뉴"
          >

            <a
              href="#company"
              onClick={(e) =>
                handleSectionNavigation(e, "company")
              }
            >
              회사소개
            </a>

            <a
              href="#business"
              onClick={(e) =>
                handleSectionNavigation(e, "business")
              }
            >
              사업영역
            </a>

            <a
              href="#brands"
              onClick={(e) =>
                handleSectionNavigation(e, "brands")
              }
            >
              브랜드
            </a>

            <a
              href={BYEOL_GUKSU_URL}
              onClick={closeMenu}
            >
              별국수
            </a>

            <button
              type="button"
              className="nav-contact"
              onClick={() => {
                scrollToSection("contact");
                closeMenu();
              }}
            >
              상담신청
            </button>

          </nav>
        </div>
      </header>

      {/* ===================================================
          MAIN
          =================================================== */}

      <main>

        {/* =================================================
            HERO
            ================================================= */}

        <section className="hero">
          <div className="hero-inner">

            <div className="hero-copy">

              <p className="eyebrow">
                MATCHON · FRANCHISE & PARTNERSHIP
              </p>

              <h1>
                브랜드와 사람을 연결하고,
                <br />
                <em>성장의 기회를 만듭니다.</em>
              </h1>

              <p className="hero-description">
                매치온은 외식 프랜차이즈 브랜드의
                발굴·개발·운영과 가맹점주 및 파트너
                매칭을 함께 고민하는 프랜차이즈
                플랫폼입니다.
              </p>

              <div className="hero-buttons">

                <button
                  type="button"
                  className="red"
                  onClick={() => {
                    scrollToSection("brands");
                    closeMenu();
                  }}
                >
                  브랜드 살펴보기 ↗
                </button>

                <button
                  type="button"
                  className="outline"
                  onClick={() => {
                    scrollToSection("contact");
                    closeMenu();
                  }}
                >
                  창업 상담하기
                </button>

              </div>
            </div>

            <div
              className="hero-visual"
              aria-hidden="true"
            >
              <div className="hero-card">

                <span>M</span>

                <strong>
                  MATCH
                </strong>

                <small>
                  ON
                </small>

              </div>
            </div>

          </div>
        </section>

        {/* =================================================
            COMPANY
            ================================================= */}

        <section
          id="company"
          className="section company-section"
        >
          <div className="section-inner">

            <p className="eyebrow">
              ABOUT MATCHON
            </p>

            <h2>
              좋은 브랜드와
              <br />
              좋은 파트너를 연결합니다.
            </h2>

            <p className="section-lead">
              매치온은 단순히 가맹점을 모집하는 회사를
              넘어 브랜드와 가맹점주가 함께 성장할 수
              있는 구조를 만드는 것을 목표로 합니다.
            </p>

            <div className="three-grid">

              <article>
                <b>01</b>

                <h3>
                  브랜드 개발
                </h3>

                <p>
                  외식시장과 고객의 변화에 맞춰
                  새로운 브랜드와 사업모델을
                  개발합니다.
                </p>
              </article>

              <article>
                <b>02</b>

                <h3>
                  가맹점 매칭
                </h3>

                <p>
                  예비창업자의 투자규모와 희망지역을
                  분석하여 적합한 브랜드와 연결합니다.
                </p>
              </article>

              <article>
                <b>03</b>

                <h3>
                  운영 파트너십
                </h3>

                <p>
                  오픈 이후에도 물류·마케팅·운영
                  시스템을 통해 지속적인 성장을
                  지원합니다.
                </p>
              </article>

            </div>
          </div>
        </section>

        {/* =================================================
            BUSINESS
            ================================================= */}

        <section
          id="business"
          className="section cream business-section"
        >
          <div className="section-inner">

            <p className="eyebrow">
              BUSINESS
            </p>

            <h2>
              매칭에서 시작해
              <br />
              운영까지 연결합니다.
            </h2>

            <div className="business-grid">

              <article>
                <span>01</span>

                <h3>
                  프랜차이즈 사업
                </h3>

                <p>
                  외식 브랜드의 가맹사업 기획과
                  운영, 가맹점 모집을 지원합니다.
                </p>
              </article>

              <article>
                <span>02</span>

                <h3>
                  브랜드 파트너십
                </h3>

                <p>
                  브랜드와 사업자 사이의 협력
                  기회를 발굴하고 연결합니다.
                </p>
              </article>

              <article>
                <span>03</span>

                <h3>
                  상권 맞춤형 모델
                </h3>

                <p>
                  상권과 점포 조건에 따라 메뉴와
                  운영모델을 유연하게 설계합니다.
                </p>
              </article>

              <article>
                <span>04</span>

                <h3>
                  창업 컨설팅
                </h3>

                <p>
                  투자금액과 희망지역을 기준으로
                  적합한 창업모델을 함께 검토합니다.
                </p>
              </article>

            </div>
          </div>
        </section>

        {/* =================================================
            BRAND PORTFOLIO
            ================================================= */}

        <section
          id="brands"
          className="dark-section brand-section"
        >
          <div className="section-inner">

            <p className="eyebrow">
              BRAND PORTFOLIO
            </p>

            <h2>
              매치온이 함께 만드는
              <br />
              외식 브랜드
            </h2>

            <div className="brand-grid">

              {brands.map((brand) => (
                <article
                  className={
                    brand.featured
                      ? "brand-card featured"
                      : "brand-card"
                  }
                  key={brand.no}
                >

                  <div className="brand-card-top">
                    <span>
                      {brand.no}
                    </span>

                    <small>
                      {brand.en}
                    </small>
                  </div>

                  <h3>
                    {brand.name}
                  </h3>

                  <p>
                    {brand.desc}
                  </p>

                  <a href={brand.link}>
                    자세히 보기 →
                  </a>

                </article>
              ))}

            </div>
          </div>
        </section>

        {/* =================================================
            FEATURED BRAND — BYEOL GUKSU
            ================================================= */}

        <section
          className="featured-brand"
          id="byeol-guksu"
        >
          <div className="section-inner">

            <div className="featured-brand-copy">

              <p className="eyebrow">
                FEATURED BRAND · K-NOODLE
              </p>

              <h2>
                상권에 맞추고,
                <br />
                매장에 맞춰 성장하는
                <br />
                <em>별국수</em>
              </h2>

              <p>
                국수를 중심으로 밥·분식·돈가스 등을
                선택적으로 구성하는 유연한 K-누들
                프랜차이즈 모델입니다.
              </p>

              <a
                href={BYEOL_GUKSU_URL}
                className="red-link"
              >
                별국수 홈페이지 보기 →
              </a>

            </div>

            <div
              className="featured-star"
              aria-hidden="true"
            >
              ★
            </div>

          </div>
        </section>

        {/* =================================================
            CONTACT
            ================================================= */}

        <section
          id="contact"
          className="contact-section"
        >
          <div className="contact-inner">

            <div className="contact-copy">

              <p className="eyebrow">
                FRANCHISE & PARTNERSHIP
              </p>

              <h2>
                새로운 사업의
                <br />
                가능성을 함께 찾아보세요.
              </h2>

              <p>
                관심 브랜드와 희망 지역,
                투자 가능 범위를 알려주시면
                매치온에서 검토 후 연락드리겠습니다.
              </p>

              <a
                href={`mailto:${EMAIL}`}
                className="contact-email"
              >
                {EMAIL}
              </a>

            </div>

            <form
              onSubmit={submit}
              className="contact-form"
            >

              <label>
                <span>
                  관심 브랜드
                </span>

                <select name="brand">
                  <option value="별국수">
                    별국수
                  </option>

                  <option value="별스트리트">
                    별스트리트
                  </option>

                  <option value="별그릴">
                    별그릴
                  </option>

                  <option value="그로타피맥">
                    그로타피맥
                  </option>

                  <option value="기타 상담">
                    기타 상담
                  </option>
                </select>
              </label>

              <label>
                <span>
                  성명 / 업체명 *
                </span>

                <input
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="성명 또는 업체명을 입력해주세요"
                />
              </label>

              <label>
                <span>
                  연락처 *
                </span>

                <input
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="연락 가능한 전화번호"
                />
              </label>

              <label>
                <span>
                  희망 출점지역 *
                </span>

                <input
                  name="region"
                  type="text"
                  required
                  placeholder="예: 서울 강남구"
                />
              </label>

              <label>
                <span>
                  투자 가능 범위
                </span>

                <select name="budget">
                  <option value="5,000만원 이하">
                    5,000만원 이하
                  </option>

                  <option value="5,000~7,000만원">
                    5,000~7,000만원
                  </option>

                  <option value="7,000만원~1억원">
                    7,000만원~1억원
                  </option>

                  <option value="1억원 이상">
                    1억원 이상
                  </option>

                  <option value="상담 필요">
                    상담 필요
                  </option>
                </select>
              </label>

              <label>
                <span>
                  문의내용
                </span>

                <textarea
                  name="message"
                  rows="5"
                  placeholder="문의하실 내용을 입력해주세요"
                />
              </label>

              <label className="privacy-check">

                <input
                  name="privacy"
                  type="checkbox"
                  required
                />

                <span>
                  가맹상담을 위한 개인정보
                  수집·이용에 동의합니다.
                </span>

              </label>

              <button
                type="submit"
                className="red contact-submit"
                disabled={sending}
              >
                {sending
                  ? "접수 중..."
                  : "상담 신청하기"}
              </button>

              {sent && (
                <p
                  className="success-message"
                  role="status"
                >
                  상담 신청이 접수되었습니다.
                  빠른 시간 내에 연락드리겠습니다.
                </p>
              )}

            </form>
          </div>
        </section>

      </main>

      {/* ===================================================
          FOOTER
          =================================================== */}

      <footer className="footer">

        <div className="footer-inner">

          <div className="footer-brand">

            <strong>
              매치온
            </strong>

            <span>
              MATCHON · FRANCHISE & PARTNERSHIP
            </span>

          </div>

          <div className="footer-contact">

            <a href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>

            <p>
              © 2026 MATCHON. All Rights Reserved.
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}

/* =========================================================
   APP ROUTER
   ========================================================= */

export default function App() {
  const pathname = window.location.pathname;

  /*
    GitHub Pages:
    /matchon-platform/byeolguksu/
    /byeolguksu/
    두 가지 상황 모두 대응
  */

  const isByeolGuksu =
    pathname === "/byeolguksu" ||
    pathname === "/byeolguksu/" ||
    pathname.endsWith("/byeolguksu") ||
    pathname.endsWith("/byeolguksu/");

  if (isByeolGuksu) {
    return (
      <ByeolGuksu
        consultationEndpoint={CONSULTATION_ENDPOINT}
      />
    );
  }

  return <Home />;
}
