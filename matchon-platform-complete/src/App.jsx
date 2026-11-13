import React, { useState } from "react";
import ByeolGuksu from "./pages/ByeolGuksu";

const EMAIL = "matchon7@daum.net";
const CONSULTATION_ENDPOINT = `https://formsubmit.co/ajax/${EMAIL}`;

const consultationTypes = [
  "가맹본사 · 브랜드 확장",
  "예비창업 · 가맹 상담",
  "점포 · 상권 매칭",
  "사업 파트너 · 제휴 상담",
];

const businessAreas = [
  {
    no: "01",
    label: "BRAND OWNER",
    title: "가맹본사",
    type: consultationTypes[0],
    description:
      "브랜드의 확장 목표와 현재 준비 상황을 바탕으로 가맹 희망자 발굴, 지역 파트너 연결, 상담 흐름 정리 등 필요한 협업 범위를 함께 살펴봅니다.",
    details: "희망 권역 · 모집 방식 · 본사 지원 범위",
  },
  {
    no: "02",
    label: "FUTURE FOUNDER",
    title: "예비창업자",
    type: consultationTypes[1],
    description:
      "관심 브랜드와 업종, 희망 지역, 투자 범위, 창업 시기를 확인해 검토 가능한 선택지를 안내합니다. 계약 전에는 각 브랜드의 최신 공식 자료와 조건을 확인하도록 돕습니다.",
    details: "관심 브랜드 · 지역 · 투자 범위 · 희망 시기",
  },
  {
    no: "03",
    label: "STORE & AREA",
    title: "점포·상권 보유자",
    type: consultationTypes[2],
    description:
      "점포 주소와 면적, 임대·매매 조건, 주변 업종과 시설 상태를 바탕으로 적합한 브랜드와 매칭 가능성을 검토합니다. 필요하면 현장 확인에 필요한 항목도 함께 정리합니다.",
    details: "소재지 · 면적 · 거래 조건 · 시설 현황",
  },
  {
    no: "04",
    label: "BUSINESS PARTNER",
    title: "사업 협력 파트너",
    type: consultationTypes[3],
    description:
      "인테리어·시공·설비·물류·식자재·기술·마케팅 등 외식사업에 필요한 제안을 검토합니다. 제공 지역과 역량, 협력 방식, 수행 사례를 바탕으로 접점을 찾습니다.",
    details: "협력 분야 · 제공 지역 · 수행 역량 · 제안 방식",
  },
];

const brands = [
  {
    no: "01",
    name: "별국수",
    en: "BYEOL GUKSU",
    desc: "K-누들 중심의 유연한 외식 프랜차이즈",
    link: "/byeolguksu/",
  },
  {
    no: "02",
    name: "별스트리트",
    en: "BYEOL STREET",
    desc: "국수와 한국식 스트리트푸드 복합 모델",
    link: "/byeolguksu/#brands",
  },
  {
    no: "03",
    name: "별그릴",
    en: "BYEOL GRILL",
    desc: "한국식 BBQ·식사·모임형 외식 모델",
    link: "/byeolguksu/#brands",
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
   MATCHON GOLD M MONOGRAM
   브랜드 가이드의 금색 M 심볼을 홈페이지에서 직접 표현
   ========================================================= */

function MatchonMark({ className = "" }) {
  return (
    <svg
      className={`matchon-symbol ${className}`}
      viewBox="0 0 120 120"
      aria-label="MATCHON M"
      role="img"
    >
      <defs>
        <linearGradient
          id="matchonGoldGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#F5D77A" />
          <stop offset="28%" stopColor="#D4AF37" />
          <stop offset="55%" stopColor="#B88A20" />
          <stop offset="78%" stopColor="#E5C55B" />
          <stop offset="100%" stopColor="#A97816" />
        </linearGradient>
      </defs>

      <path
        d="
          M18 92
          L31 20
          L60 58
          L89 20
          L102 92
          L85 92
          L77 48
          L60 72
          L43 48
          L35 92
          Z
        "
        fill="url(#matchonGoldGradient)"
      />

      <path
        d="
          M43 48
          L60 72
          L77 48
          L70 36
          L60 51
          L50 36
          Z
        "
        fill="#F2D36A"
        opacity="0.95"
      />
    </svg>
  );
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function Home() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [consultationType, setConsultationType] = useState("");

  function startConsultation(type) {
    setConsultationType(type);
    scrollToSection("contact");
  }

  async function submit(e) {
    e.preventDefault();

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    if (!data.name || !data.phone || !data.region || !data.consultationType) {
      alert("상담 분야, 성명, 연락처, 지역을 입력해주세요.");
      return;
    }

    setSending(true);

    const payload = {
      ...data,
      _subject: `[매치온 상담] ${data.consultationType} · ${data.company || data.name}`,
      _template: "table",
      _replyto: data.email || undefined,
      _url: window.location.href,
      _honey: data.website || "",
    };
    delete payload.website;

    try {
      const response = await fetch(CONSULTATION_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || result.success === false) {
        throw new Error(result.message || "상담 접수에 실패했습니다.");
      }

      form.reset();
      setConsultationType("");
      setSent(true);
    } catch (error) {
      console.error(error);
      alert("상담을 전달하지 못했습니다. 잠시 후 다시 시도하거나 matchon7@daum.net으로 문의해 주세요.");
    } finally {
      setSending(false);
    }
  }

  function closeMenu() {
    setOpen(false);
  }

  return (
    <div className="matchon">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <header className="site-header">
        <div className="header-inner">

          <a href="/" className="logo">
            <img
              className="matchon-brand-logo"
              src="/images/matchon-logo.jpg"
              alt="MATCHON 매치온 프랜차이즈 매칭 & 파트너십"
            />
          </a>

          <button
            type="button"
            className="hamb"
            aria-label="메뉴 열기"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>

          <nav className={open ? "nav open" : "nav"}>

            <a
              href="#company"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("company");
                closeMenu();
              }}
            >
              회사소개
            </a>

            <a
              href="#business"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("business");
                closeMenu();
              }}
            >
              사업영역
            </a>

            <a
              href="#brands"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("brands");
                closeMenu();
              }}
            >
              브랜드
            </a>

            <a
              href="/byeolguksu/"
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

      <main>

        {/* =====================================================
            HERO
            ===================================================== */}

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
                매치온은 외식 프랜차이즈 브랜드의 발굴·개발·운영과
                가맹점주 및 파트너 매칭을 함께 고민하는
                프랜차이즈 플랫폼입니다.
              </p>

              <div className="hero-buttons">

                <button
                  type="button"
                  className="red"
                  onClick={() => scrollToSection("brands")}
                >
                  브랜드 살펴보기 ↗
                </button>

                <button
                  type="button"
                  className="outline"
                  onClick={() => scrollToSection("contact")}
                >
                  창업 상담하기
                </button>

              </div>
            </div>

            <div className="hero-visual">

              <div className="hero-card">

                <div className="hero-logo">
                  <img src="/images/matchon-logo.jpg" alt="MATCHON 매치온" />
                </div>

                <p>
                  브랜드 본사와 창업자, 점포와 사업 파트너를 잇는 실무형 매칭
                </p>

              </div>

            </div>

          </div>
        </section>

        {/* =====================================================
            COMPANY
            ===================================================== */}

        <section id="company" className="section company-section">

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
              매치온은 단순히 가맹점을 모집하는 회사를 넘어
              브랜드와 가맹점주가 함께 성장할 수 있는 구조를
              만드는 것을 목표로 합니다.
            </p>

            <div className="three-grid">

              <article>
                <b>01</b>

                <h3>
                  브랜드 개발
                </h3>

                <p>
                  외식시장과 고객의 변화에 맞춰 새로운 브랜드와
                  사업모델을 개발합니다.
                </p>
              </article>

              <article>
                <b>02</b>

                <h3>
                  가맹점 매칭
                </h3>

                <p>
                  예비창업자의 투자규모와 희망지역을 분석하여
                  적합한 브랜드와 연결합니다.
                </p>
              </article>

              <article>
                <b>03</b>

                <h3>
                  운영 파트너십
                </h3>

                <p>
                  오픈 이후에도 물류·마케팅·운영 시스템을
                  통해 지속적인 성장을 지원합니다.
                </p>
              </article>

            </div>
          </div>

        </section>

        {/* =====================================================
            BUSINESS
            ===================================================== */}

        <section
          id="business"
          className="section business-section"
        >

          <div className="section-inner">

            <p className="eyebrow">
              BUSINESS
            </p>

            <h2>
              매치온이 연결하는
              <br />
              네 가지 사업 기회
            </h2>

            <p className="business-intro">
              가맹본사·예비창업자·점포 보유자·사업 파트너의 서로 다른 목표와 조건을 확인하고,
              필요한 상담 항목을 분야별로 나누어 구체적인 다음 단계를 함께 검토합니다.
            </p>

            <div className="business-grid">
              {businessAreas.map((area) => (
                <article key={area.no}>
                  <span>{area.no}</span>
                  <small>{area.label}</small>
                  <h3>{area.title}</h3>
                  <p>{area.description}</p>
                  <div className="business-details">상담 시 함께 확인 <b>{area.details}</b></div>
                  <button type="button" onClick={() => startConsultation(area.type)}>
                    {area.type} <span aria-hidden="true">↗</span>
                  </button>
                </article>
              ))}

            </div>
          </div>

        </section>

        {/* =====================================================
            BRANDS
            ===================================================== */}

        <section
          id="brands"
          className="dark-section"
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
                  className="brand-card"
                  key={brand.no}
                >

                  <span>
                    {brand.no}
                  </span>

                  <h3>
                    {brand.name}
                  </h3>

                  <small>
                    {brand.en}
                  </small>

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

        {/* =====================================================
            FEATURED BRAND
            ===================================================== */}

        <section className="featured-brand">

          <div className="section-inner">

            <div>

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
                href="/byeolguksu/"
                className="red-link"
              >
                별국수 홈페이지 보기 →
              </a>

            </div>

            <div className="featured-star">

              <div className="featured-mark">
                <MatchonMark />
              </div>

              <strong>
                BYEOL
              </strong>

              <span>
                GUKSU
              </span>

            </div>

          </div>

        </section>

        {/* =====================================================
            CONTACT
            ===================================================== */}

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
                상담 분야와 현재 상황, 희망 지역 및 협력 목표를 남겨주시면
                내용을 확인한 뒤 매치온에서 연락드리겠습니다.
              </p>

              <a href={`mailto:${EMAIL}`} className="contact-email">
                {EMAIL}
              </a>

            </div>

            <form
              onSubmit={submit}
              className="contact-form"
            >

              <label className="contact-honeypot" aria-hidden="true">
                Website
                <input name="website" type="text" tabIndex={-1} autoComplete="off" />
              </label>

              <label>
                상담 분야 *
                <select
                  name="consultationType"
                  required
                  value={consultationType}
                  onChange={(e) => setConsultationType(e.target.value)}
                >
                  <option value="">상담 분야를 선택해 주세요</option>
                  {consultationTypes.map((type) => <option key={type}>{type}</option>)}
                </select>
              </label>

              <label>
                관심 브랜드 / 제안 분야
                <input name="interest" type="text" placeholder="예: 별국수, 서울 강남 점포, 식자재 물류 제휴" />
              </label>

              <label>
                성명 *

                <input
                  name="name"
                  type="text"
                  required
                  placeholder="성명 또는 업체명을 입력해주세요"
                />
              </label>

              <label>
                회사·브랜드명
                <input name="company" type="text" placeholder="업체 또는 브랜드명 (개인은 생략 가능)" />
              </label>

              <label>
                연락처 *

                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="연락 가능한 전화번호"
                />
              </label>

              <label>
                회신 이메일
                <input name="email" type="email" placeholder="회신받을 이메일 (선택)" />
              </label>

              <label>
                주요 활동 지역 / 희망 지역 *

                <input
                  name="region"
                  type="text"
                  required
                  placeholder="예: 서울 전역 / 매장 소재지 / 담당 권역"
                />
              </label>

              <label>
                사업 규모 / 투자 범위

                <input name="scope" type="text" placeholder="점포 면적, 투자 범위, 협력 규모 등" />
              </label>

              <label>
                문의내용

                <textarea
                  name="message"
                  rows="5"
                  placeholder="희망하는 협력 내용, 현재 준비 상황, 희망 일정 등 상담에 필요한 내용을 적어주세요"
                />
              </label>

              <label className="privacy-check">

                <input
                  type="checkbox"
                  name="privacyConsent"
                  value="동의"
                  required
                />

                <span>
                  상담 회신을 위해 입력한 성명, 업체명, 연락처, 이메일, 지역 및 문의 내용을 수집하고 이메일 전달 서비스(FormSubmit.co)를 통해 매치온에 전달하는 데 동의합니다.
                </span>

              </label>

              <button
                type="submit"
                className="red"
                disabled={sending}
              >
                {sending
                  ? "접수 중..."
                  : "상담 신청하기"}
              </button>

              {sent && (
                <p className="success-message">
                  상담 내용이 이메일로 전달되었습니다. 확인 후 연락드리겠습니다.
                </p>
              )}

            </form>

          </div>

        </section>

      </main>

      {/* =====================================================
          FOOTER
          ===================================================== */}

      <footer className="footer">

        <a className="footer-brand" href="/" aria-label="매치온 홈페이지">
          <img className="matchon-brand-logo footer-brand-logo" src="/images/matchon-logo.jpg" alt="MATCHON 매치온 프랜차이즈 매칭 & 파트너십" />
        </a>

        <div className="footer-copy">

          <span>
            MATCHON · FRANCHISE & PARTNERSHIP
          </span>

          <p>
            © 2026 MATCHON. All Rights Reserved.
          </p>

        </div>

      </footer>

    </div>
  );
}

export default function App() {
  const path = window.location.pathname;

  if (
    path === "/byeolguksu" ||
    path === "/byeolguksu/"
  ) {
    return (
      <ByeolGuksu
        consultationEndpoint={CONSULTATION_ENDPOINT}
      />
    );
  }

  return <Home />;
}