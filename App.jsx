import { useState, useEffect, useRef } from "react";

/* ============================================================
   マンジャーレくれは — 昼は紙メニュー、夜は黒板。
   ☀/🌙 スイッチでサイト全体が変身します。
   ============================================================ */

const REDUCED =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- スクロールで浮き上がる ---------- */
function Rv({ children, delay = 0, as = "div", className = "", style = {} }) {
  const ref = useRef(null);
  const [on, setOn] = useState(REDUCED);
  useEffect(() => {
    if (REDUCED) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Tag = as;
  return (
    <Tag
      ref={ref}
      className={`rv ${on ? "on" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </Tag>
  );
}

/* ---------- 写真プレースホルダー ---------- */
function Ph({ label, ratio = "4/3", className = "" }) {
  return (
    <div className={`ph ${className}`} style={{ aspectRatio: ratio }}>
      <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
        <rect x="3" y="6" width="28" height="22" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="14" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M6 25l8-8 6 6 4-4 6 6" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
      <span>{label}</span>
    </div>
  );
}

/* ---------- 手描き食材イラスト ---------- */
function Doodle({ kind, className = "", style = {} }) {
  const stroke = "currentColor";
  const art = {
    tomato: (
      <svg width="56" height="56" viewBox="0 0 54 54">
        <circle cx="27" cy="31" r="17" fill="none" stroke={stroke} strokeWidth="2.5" />
        <path d="M27 14c-2-5 2-9 2-9M21 15c2-3 6-4 6-4s4 1 6 4" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    basil: (
      <svg width="50" height="58" viewBox="0 0 50 56">
        <path d="M25 8c8 4 12 12 10 22-2 9-10 13-10 13s-8-4-10-13C13 20 17 12 25 8z" fill="none" stroke={stroke} strokeWidth="2.5" />
        <path d="M25 14v26" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    wine: (
      <svg width="44" height="64" viewBox="0 0 44 62">
        <path d="M10 8h24c0 12-5 18-12 19v22m-8 0h16M10 8c0 8 3 14 8 17" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    fork: (
      <svg width="36" height="64" viewBox="0 0 36 62">
        <path d="M12 6v14M18 6v14M24 6v14M18 20v36M12 14c0 5 3 8 6 8s6-3 6-8" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    pizza: (
      <svg width="58" height="58" viewBox="0 0 56 56">
        <path d="M8 12l40 8-30 28z" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="24" cy="24" r="3" fill="none" stroke={stroke} strokeWidth="2" />
        <circle cx="30" cy="34" r="3" fill="none" stroke={stroke} strokeWidth="2" />
      </svg>
    ),
  };
  return (
    <span className={`doodle ${className}`} style={style} aria-hidden="true">
      {art[kind]}
    </span>
  );
}

/* ---------- メニューデータ(取材写真より) ---------- */
const DINNER = [
  {
    cat: "スパゲティ",
    color: "y",
    items: [
      ["フルーツトマトとモッツァレラチーズのトマトソース", "1,200"],
      ["手作りベーコンのピリ辛トマトソース", "1,380"],
      ["小松菜、イワシのペペロンチーノ", "1,380"],
      ["明太子とホタテ、レモン風味", "1,500"],
      ["手作りベーコンのカルボナーラ", "1,500"],
      ["ボロニェーゼ（ミートソース）", "1,380"],
    ],
  },
  {
    cat: "ピッツァ",
    color: "p",
    items: [
      ["マルゲリータ", "1,500"],
      ["自家製オイルサーディンとトマト", "1,600"],
      ["手作りベーコンとトマト", "1,680"],
      ["ブルーチーズとリンゴ", "1,800"],
    ],
  },
  {
    cat: "魚料理",
    color: "p",
    items: [
      ["真鯛のポワレ 黒酢ソース", "2,000"],
      ["サーモンのワイン蒸し 香草クリームソース", "2,300"],
    ],
  },
  {
    cat: "肉料理",
    color: "y",
    items: [
      ["地鶏のあぶりオーブン焼き ビネガーソース", "2,300"],
      ["奄美産島黒豚スペアリブといんげん豆のトマト煮", "2,300"],
      ["牛フィレのステーキ バルサミコソース", "2,900"],
    ],
  },
  {
    cat: "グラタン",
    color: "y",
    items: [
      ["ラザニエのミートグラタン", "1,800"],
      ["サーモンとポテトのマカロニクリームグラタン", "2,000"],
    ],
  },
];

const TOPICS = [
  { tag: "季節限定", title: "初夏のおすすめメニュー、はじまりました", text: "旬の食材を使った季節の一皿をご用意しています。（サンプル）", ph: "季節のおすすめ料理の写真" },
  { tag: "ランチ", title: "お昼はお得なランチコースをどうぞ", text: "メイン料理に +280円からコースに。詳しくはお品書きへ。", ph: "ランチの写真" },
  { tag: "ドリンク", title: "料理に合うワイン、揃えてます", text: "グラスからボトルまで。お気軽にご相談ください。（サンプル）", ph: "ワインの写真" },
  { tag: "お知らせ", title: "貸切・パーティーのご相談も", text: "記念日やご宴会など、お気軽にお問い合わせください。（サンプル）", ph: "店内の写真" },
];

const GALLERY = [
  ["自慢のパスタ", "料理の写真"],
  ["前菜の盛り合わせ", "料理の写真"],
  ["あたたかい店内", "店内の写真"],
  ["ドルチェ", "料理の写真"],
  ["ワインも豊富", "ワインの写真"],
  ["くれはの里の交差点角", "外観の写真"],
];

const NAV = [
  ["home", "ホーム"],
  ["menu", "お品書き"],
  ["gallery", "写真"],
  ["news", "お知らせ"],
  ["access", "アクセス"],
];

/* ============================================================ */
export default function App() {
  const [theme, setTheme] = useState("lunch"); // lunch | dinner
  const [page, setPage] = useState("home");
  const [intro, setIntro] = useState(!REDUCED);
  const [curtain, setCurtain] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  /* オープニング */
  useEffect(() => {
    if (!intro) return;
    const t = setTimeout(() => setIntro(false), 2400);
    return () => clearTimeout(t);
  }, [intro]);

  /* パララックス */
  useEffect(() => {
    if (REDUCED) return;
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        raf = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ページ切替(カーテン演出) */
  const go = (p) => {
    setNavOpen(false);
    if (p === page) return;
    if (REDUCED) {
      setPage(p);
      window.scrollTo(0, 0);
      return;
    }
    setCurtain(true);
    setTimeout(() => {
      setPage(p);
      window.scrollTo(0, 0);
    }, 380);
    setTimeout(() => setCurtain(false), 820);
  };

  const flip = () => setTheme((t) => (t === "lunch" ? "dinner" : "lunch"));
  const D = theme === "dinner";

  return (
    <div className="site" data-theme={theme}>
      <Style />

      {/* ===== オープニング ===== */}
      {intro && (
        <div className="intro" onClick={() => setIntro(false)}>
          <svg viewBox="0 0 300 170" className="intro-svg">
            <ellipse cx="150" cy="85" rx="128" ry="62" fill="none" stroke="currentColor" strokeWidth="3" pathLength="100" className="intro-ring" />
            <text x="150" y="78" textAnchor="middle" className="intro-latin">MANGIARE</text>
            <text x="150" y="112" textAnchor="middle" className="intro-jp">食べておくんなはれ!!</text>
          </svg>
        </div>
      )}

      {/* ===== カーテン ===== */}
      <div className={`curtain ${curtain ? "on" : ""}`} aria-hidden="true">
        <span className="curtain-word">Mangiare!</span>
      </div>

      {/* ===== ヘッダー ===== */}
      <header>
        <button className="logo" onClick={() => go("home")}>
          <span className="latin">Mangiare</span>
          <small>マンジャーレくれは</small>
        </button>
        <nav className={navOpen ? "open" : ""}>
          {NAV.map(([id, label]) => (
            <button key={id} className={page === id ? "cur" : ""} onClick={() => go(id)}>
              {label}
            </button>
          ))}
        </nav>
        <div className="head-right">
          {/* 昼夜スイッチ */}
          <button className="flip" onClick={flip} aria-label={D ? "ランチモードへ" : "ディナーモードへ"}>
            <span className="flip-track">
              <span className="flip-thumb">{D ? "🌙" : "☀️"}</span>
            </span>
            <span className="flip-label">{D ? "ディナー" : "ランチ"}</span>
          </button>
          <button className="burger" onClick={() => setNavOpen((o) => !o)} aria-expanded={navOpen}>
            ☰
          </button>
        </div>
      </header>

      <main>
        {page === "home" && <Home go={go} scrollY={scrollY} D={D} />}
        {page === "menu" && <MenuPage D={D} />}
        {page === "gallery" && <GalleryPage onOpen={setLightbox} />}
        {page === "news" && <NewsPage />}
        {page === "access" && <AccessPage />}
      </main>

      {/* ===== ライトボックス ===== */}
      {lightbox !== null && (
        <div className="lb" onClick={() => setLightbox(null)}>
          <figure className="lb-card" onClick={(e) => e.stopPropagation()}>
            <Ph label={GALLERY[lightbox][1]} ratio="4/3" />
            <figcaption>{GALLERY[lightbox][0]}</figcaption>
            <button className="lb-x" onClick={() => setLightbox(null)} aria-label="閉じる">×</button>
          </figure>
        </div>
      )}

      <footer>
        <p className="latin">MANGIARE KUREHA</p>
        <span className="hand">ぜひ "池田くれはの里" で、マンジャーレ!!</span>
        <small>© Mangiare Kureha. All rights reserved.</small>
      </footer>
    </div>
  );
}

/* ============================================================
   ホーム
   ============================================================ */
function Home({ go, scrollY, D }) {
  return (
    <>
      {/* Hero */}
      <div className="hero">
        <Doodle kind="tomato" className="dd d1" style={{ transform: `translateY(${scrollY * -0.12}px)` }} />
        <Doodle kind="basil" className="dd d2" style={{ transform: `translateY(${scrollY * -0.2}px)` }} />
        <Doodle kind="wine" className="dd d3" style={{ transform: `translateY(${scrollY * -0.08}px)` }} />
        <Doodle kind="fork" className="dd d4" style={{ transform: `translateY(${scrollY * -0.16}px)` }} />
        <Doodle kind="pizza" className="dd d5" style={{ transform: `translateY(${scrollY * -0.1}px)` }} />

        <p className="eyebrow">OSAKA IKEDA — ITALIANO &amp; FRANCESE</p>
        <h1 aria-label="MANGIARE">
          {"MANGIARE".split("").map((c, i) => (
            <span key={i} style={{ animationDelay: `${0.15 + i * 0.06}s` }}>{c}</span>
          ))}
        </h1>
        <p className="kureha">マンジャーレくれは</p>
        <p className="lead">
          現地イタリア・フランスの素材はもちろん、日本の素材にもこだわった、
          家庭的なイタリアン・フレンチのお店です。
          {D ? "今夜は黒板から、お好きな一皿をどうぞ。" : "お昼はお得なランチコースをどうぞ。"}
        </p>
        <p className="stamp">食べておくんなはれ!!</p>
        <div className="hero-info">
          <div><b>Lunch</b>11:30 – 15:00</div>
          <div><b>Dinner</b>17:30 – 21:00</div>
          <div><b>定休日</b>水曜日</div>
          <div><b>TEL</b>072-763-0338</div>
        </div>
        <p className="hint">☀️/🌙 で昼と夜のお店に切り替わります</p>
      </div>

      {/* ティッカー */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker-in">
          {[0, 1].map((k) => (
            <span key={k}>
              <i className="latin">MANGIARE</i><i>✳</i><i>食べておくんなはれ!!</i><i>✳</i>
              <i className="latin">BUON APPETITO</i><i>✳</i><i>池田・くれはの里</i><i>✳</i>
            </span>
          ))}
        </div>
      </div>

      {/* TOPICS */}
      <section className="topics">
        <Rv><SecHead latin="Topics" jp="トピックス" /></Rv>
        <Carousel />
      </section>

      {/* こだわり */}
      <section>
        <Rv><SecHead latin="La Nostra Cucina" jp="マンジャーレくれはのこだわり" /></Rv>
        <div className="about-grid">
          <Rv>
            <h3 className="serif about-h">
              池田・くれはの里で、<br />毎日食べたくなるイタリアンを。
            </h3>
            <p className="about-p">
              「マンジャーレ」はイタリア語で「食べる」。
              特別な日だけでなく、ふらっと立ち寄った日もおいしい——
              そんな"街の食堂"のようなイタリアン・フレンチを目指しています。
            </p>
            <p className="about-p">
              イタリア・フランス直送の食材と、日本各地の旬の素材。
              どちらの良さも生かした、ここでしか食べられない一皿をご用意しています。
            </p>
            <ul className="about-points">
              <li>現地の素材 × 日本の旬を組み合わせたオリジナル料理</li>
              <li>自家製ハーブや、生産者から届くこだわりの食材</li>
              <li>手作りベーコンに自家製オイルサーディン</li>
            </ul>
          </Rv>
          <Rv delay={150}>
            <Ph label={"店内 or 料理の写真\n（縦位置がおすすめ）"} ratio="4/5" className="about-photo" />
          </Rv>
        </div>
      </section>

      {/* ショートカット */}
      <div className="shortcuts">
        {[["menu", "お品書き", "MENU"], ["gallery", "写真", "GALLERIA"], ["news", "お知らせ", "NOTIZIE"], ["access", "アクセス", "ACCESSO"]].map(([id, jp, en], i) => (
          <Rv key={id} delay={i * 90}>
            <button className="shortcut" onClick={() => go(id)}>
              {jp}<small className="latin">{en}</small>
            </button>
          </Rv>
        ))}
      </div>
    </>
  );
}

function SecHead({ latin, jp }) {
  return (
    <div className="sec-head">
      <span className="latin">{latin}</span>
      <span className="jp">{jp}</span>
    </div>
  );
}

/* ============================================================
   TOPICS カルーセル(スワイプ・自動送り)
   ============================================================ */
function Carousel() {
  const [idx, setIdx] = useState(0);
  const timer = useRef(null);
  const touch = useRef(null);
  const n = TOPICS.length;

  const restart = () => {
    if (timer.current) clearInterval(timer.current);
    if (!REDUCED) timer.current = setInterval(() => setIdx((i) => (i + 1) % n), 4500);
  };
  useEffect(() => {
    restart();
    return () => timer.current && clearInterval(timer.current);
  }, []);

  const go = (i) => {
    setIdx(((i % n) + n) % n);
    restart();
  };

  return (
    <div
      className="car"
      onTouchStart={(e) => {
        touch.current = e.touches[0].clientX;
        if (timer.current) clearInterval(timer.current);
      }}
      onTouchEnd={(e) => {
        if (touch.current == null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
        else restart();
        touch.current = null;
      }}
    >
      <div className="car-win">
        <div className="car-track" style={{ transform: `translateX(-${idx * 100}%)` }}>
          {TOPICS.map((t, i) => (
            <article className={`car-slide ${i === idx ? "cur" : ""}`} key={i}>
              <Ph label={t.ph} ratio="16/9" />
              <div className="car-body">
                <span className="car-tag">{t.tag}</span>
                <h4 className="serif">{t.title}</h4>
                <p>{t.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="car-nav">
        <button className="car-btn" onClick={() => go(idx - 1)} aria-label="前へ">‹</button>
        {TOPICS.map((_, i) => (
          <button key={i} className={`car-dot ${i === idx ? "on" : ""}`} onClick={() => go(i)} aria-label={`${i + 1}枚目へ`} />
        ))}
        <button className="car-btn" onClick={() => go(idx + 1)} aria-label="次へ">›</button>
      </div>
      <div className="car-bar"><span key={idx} className="car-fill" /></div>
    </div>
  );
}

/* ============================================================
   お品書き
   ============================================================ */
function MenuPage({ D }) {
  return (
    <div className="menu-bg">
      <section>
        <Rv><SecHead latin="Menu" jp="お品書き" /></Rv>

        {/* 手描きランチ */}
        <Rv>
          <div className="paper-card">
            <h3 className="chalk-latin paper-title">LUNCH MENU</h3>
            <p className="paper-time">ランチ｜11:30 – 15:00　メイン料理にプラスで</p>
            <div className="lunch-grid">
              {[
                ["A course", "+¥280", ["サラダ（生野菜／カポナータ／温野菜）", "又は ミネストローネスープ"]],
                ["B course", "+¥680", ["サラダ（お選びください）", "パン", "ドルチェ"]],
                ["C course", "+¥1,500", ["アンティパストの盛り合わせ", "パン", "ドルチェ"]],
              ].map(([name, price, items], i) => (
                <div className="course-box" key={i} style={{ transitionDelay: `${i * 90}ms` }}>
                  <span className="c-name">{name}</span> <span className="c-price">{price}</span>
                  <ul>{items.map((it, j) => <li key={j}>{it}</li>)}</ul>
                </div>
              ))}
            </div>
            <div className="lunch-sets">
              <div className="set-line">
                <span><b>ペンネランチ</b><br /><small>サラダ＋ペンネ（手作りベーコンのピリ辛トマトソース）</small></span>
                <span className="c-price">¥1,380</span>
              </div>
              <div className="set-line">
                <span><b>おそうざい・スープセット</b><br /><small>おそうざいの盛り合わせ＋スープ＋パン</small></span>
                <span className="c-price">¥1,580</span>
              </div>
            </div>
            <p className="paper-note">※ お昼のお席は2時間ほどでお願いしております</p>
          </div>
        </Rv>

        {/* 黒板ディナー */}
        <Rv>
          <div className="chalkboard">
            <h3 className="chalk-latin board-title">Menu</h3>
            <p className="board-time">パスタ・ピッツァ・お肉・お魚いろいろ</p>
            <div className="chalk-cols">
              {[DINNER.slice(0, 2), DINNER.slice(2)].map((col, ci) => (
                <div key={ci}>
                  {col.map((g) => (
                    <div key={g.cat}>
                      <span className={`chalk-cat ${g.color}`}>{g.cat}</span>
                      {g.items.map(([name, price], i) => (
                        <ChalkRow key={i} name={name} price={price} delay={i * 60} />
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <p className="board-note">※ 魚・肉料理は温野菜・パン又はライス付き。仕入れにより内容が変わります。</p>
          </div>
        </Rv>

        <Rv><p className="sample-note">※ 取材記事の写真をもとにした内容です。最新の価格・メニューに合わせて調整してください。</p></Rv>
      </section>
    </div>
  );
}

function ChalkRow({ name, price, delay }) {
  return (
    <Rv delay={delay} className="chalk-item-wrap">
      <div className="chalk-item">
        <span>{name}</span>
        <span className="dots" />
        <span className="price">{price}</span>
      </div>
    </Rv>
  );
}

/* ============================================================
   写真 / お知らせ / アクセス
   ============================================================ */
function GalleryPage({ onOpen }) {
  return (
    <section>
      <Rv><SecHead latin="Galleria" jp="写真ギャラリー" /></Rv>
      <div className="gallery">
        {GALLERY.map(([cap, ph], i) => (
          <Rv key={i} delay={i * 80}>
            <figure className="polaroid" onClick={() => onOpen(i)} role="button" tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onOpen(i)}>
              <Ph label={ph} ratio="1/1" />
              <figcaption>{cap}</figcaption>
            </figure>
          </Rv>
        ))}
      </div>
      <Rv><p className="sample-note">写真をタップすると大きく表示されます</p></Rv>
    </section>
  );
}

function NewsPage() {
  const items = [
    ["2026.06", "季節のおすすめメニューが始まりました（サンプル）"],
    ["2026.05", "臨時休業のお知らせ（サンプル）"],
    ["2026.04", "ホームページをリニューアルしました（サンプル）"],
  ];
  return (
    <section>
      <Rv><SecHead latin="Notizie" jp="お知らせ" /></Rv>
      <div className="news-grid">
        <ul className="news-list">
          {items.map(([d, t], i) => (
            <Rv as="li" key={i} delay={i * 80}>
              <time className="latin">{d}</time><span>{t}</span>
            </Rv>
          ))}
        </ul>
        <Rv delay={200}>
          <div className="sns-box">
            <p>本日のおすすめや最新情報は<br />SNSで発信しています。</p>
            <a className="btn" href="#" onClick={(e) => e.preventDefault()}>Instagram</a>
            <a className="btn" href="#" onClick={(e) => e.preventDefault()}>LINE 公式アカウント</a>
          </div>
        </Rv>
      </div>
    </section>
  );
}

function AccessPage() {
  return (
    <section>
      <Rv><SecHead latin="Accesso" jp="アクセス" /></Rv>
      <div className="access-grid">
        <Rv>
          <dl className="access-dl">
            <dt>店名</dt><dd className="serif">マンジャーレくれは</dd>
            <dt>住所</dt><dd>〒563-0024 大阪府池田市旭丘2-4-11-101<br /><small>くれはの里の交差点角</small></dd>
            <dt>電話</dt><dd><a href="tel:0727630338">072-763-0338</a></dd>
            <dt>営業時間</dt><dd>ランチ 11:30 – 15:00<br />ディナー 17:30 – 21:00</dd>
            <dt>定休日</dt><dd>水曜日</dd>
          </dl>
        </Rv>
        <Rv delay={150}><Ph label="Google マップ埋め込み" ratio="4/3" /></Rv>
      </div>
    </section>
  );
}

/* ============================================================
   スタイル
   ============================================================ */
function Style() {
  return (
    <style>{`
@import url('https://fonts.googleapis.com/css2?family=Italiana&family=Caveat:wght@500;600&family=Shippori+Mincho:wght@500;600;700&family=Zen+Kaku+Gothic+New:wght@400;500;700&family=Yomogi&display=swap');

/* ---------- テーマ ---------- */
.site{
  --paper:#FBF7EE; --paper2:#F3EBDC; --card:#FFFEFA;
  --ink:#2C2620; --muted:#5A5147;
  --wine:#6E2227; --wine-deep:#4A171B;
  --basil:#3E4D24; --gold:#9C742B;
  --red:#D2362E; --blue:#1F6FB2;
  --line:rgba(44,38,32,.5); --hair:rgba(44,38,32,.22);
  --cat-y:#9C742B; --cat-p:#B14A78;
}
.site[data-theme="dinner"]{
  --paper:#26382E; --paper2:#1F2F26; --card:#2E4237;
  --ink:#F3EDD8; --muted:#CfC4A4;
  --wine:#F2D26B; --wine-deep:#16211B;
  --basil:#BFD9EE; --gold:#F2D26B;
  --red:#F2A8C4; --blue:#BFD9EE;
  --line:rgba(243,237,216,.7); --hair:rgba(243,237,216,.25);
  --cat-y:#F2D26B; --cat-p:#F2A8C4;
}
.site{
  font-family:"Zen Kaku Gothic New",sans-serif;
  background:var(--paper); color:var(--ink);
  line-height:1.9; letter-spacing:.04em;
  min-height:100vh;
  transition:background .8s ease,color .8s ease;
  position:relative;
}
.site[data-theme="dinner"]{
  background-image:
    radial-gradient(ellipse at 18% 8%,rgba(255,255,255,.045),transparent 50%),
    radial-gradient(ellipse at 85% 90%,rgba(255,255,255,.035),transparent 50%);
}
.site::after{
  content:""; position:fixed; inset:10px; pointer-events:none; z-index:60;
  border:1px solid var(--line); outline:1px solid var(--line); outline-offset:3px;
  opacity:.5; transition:border-color .8s,outline-color .8s;
}
*{margin:0;padding:0;box-sizing:border-box}
button{font:inherit;color:inherit;background:none;border:none;cursor:pointer}
.latin{font-family:"Italiana",serif}
.serif{font-family:"Shippori Mincho",serif}
.hand,.chalk-latin{font-family:"Caveat",cursive}

/* ---------- 浮き上がり ---------- */
.rv{opacity:0;transform:translateY(26px);transition:opacity .7s ease,transform .7s ease}
.rv.on{opacity:1;transform:translateY(0)}

/* ---------- オープニング ---------- */
.intro{
  position:fixed;inset:0;z-index:200;
  background:var(--wine-deep);color:#F2D26B;
  display:flex;align-items:center;justify-content:center;
  animation:introOut .5s ease 1.9s both;cursor:pointer;
}
.site[data-theme="lunch"] .intro{background:#4A171B}
.intro-svg{width:min(78vw,420px)}
.intro-ring{stroke-dasharray:100;stroke-dashoffset:100;animation:draw 1.2s ease .2s forwards}
.intro-latin{font-family:"Italiana",serif;font-size:38px;fill:#FBF7EE;letter-spacing:6px;opacity:0;animation:fadeUp .6s ease .7s forwards}
.intro-jp{font-family:"Yomogi",cursive;font-size:17px;fill:#F2D26B;opacity:0;animation:fadeUp .6s ease 1.1s forwards}
@keyframes draw{to{stroke-dashoffset:0}}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes introOut{to{opacity:0;visibility:hidden}}

/* ---------- カーテン ---------- */
.curtain{
  position:fixed;inset:0;z-index:150;pointer-events:none;
  background:var(--wine-deep);
  display:flex;align-items:center;justify-content:center;
  transform:scaleY(0);transform-origin:top;
}
.site[data-theme="lunch"] .curtain{background:#6E2227}
.curtain.on{animation:sweep .82s cubic-bezier(.76,0,.24,1) both}
.curtain-word{
  font-family:"Caveat",cursive;font-size:2.2rem;color:#F2D26B;
  opacity:0;
}
.curtain.on .curtain-word{animation:wordPop .4s ease .2s both}
@keyframes sweep{
  0%{transform:scaleY(0);transform-origin:top}
  45%,55%{transform:scaleY(1)}
  100%{transform:scaleY(0);transform-origin:bottom}
}
@keyframes wordPop{from{opacity:0;transform:scale(1.4) rotate(-4deg)}to{opacity:1;transform:scale(1) rotate(-4deg)}}

/* ---------- ヘッダー ---------- */
header{
  position:sticky;top:0;z-index:90;
  display:flex;align-items:center;justify-content:space-between;gap:10px;
  padding:12px clamp(16px,4vw,40px);
  background:color-mix(in srgb,var(--paper) 88%,transparent);
  backdrop-filter:blur(8px);
  border-bottom:1px solid var(--hair);
  transition:background .8s;
}
.logo{display:flex;align-items:baseline;gap:8px;text-align:left}
.logo .latin{font-size:1.45rem;letter-spacing:.1em;color:var(--wine);transition:color .8s}
.logo small{font-family:"Shippori Mincho",serif;font-size:.74rem;letter-spacing:.16em}
nav{display:flex;gap:4px}
nav button{
  padding:7px 13px;font-size:.86rem;letter-spacing:.12em;border-radius:99px;
  font-family:"Yomogi",cursive;
  transition:background .3s,color .3s;
}
nav button.cur{background:var(--wine);color:var(--paper)}
nav button:not(.cur):hover{background:var(--paper2)}
.head-right{display:flex;align-items:center;gap:10px}
.burger{display:none;font-size:1.3rem;border:1.5px solid var(--wine);border-radius:8px;padding:2px 10px;color:var(--wine)}
@media(max-width:780px){
  nav{
    display:none;position:absolute;top:100%;left:0;right:0;
    background:var(--paper);border-bottom:2px solid var(--wine);
    flex-direction:column;padding:8px 0 14px;
    box-shadow:0 16px 28px rgba(0,0,0,.18);
  }
  nav.open{display:flex;animation:fadeUp .25s ease}
  nav button{padding:13px 28px;text-align:left;font-size:1rem;border-radius:0}
  .burger{display:block}
}

/* 昼夜スイッチ */
.flip{display:flex;align-items:center;gap:8px}
.flip-track{
  width:54px;height:28px;border-radius:99px;
  border:2px solid var(--wine);
  display:inline-flex;align-items:center;padding:1px;
  background:var(--paper2);transition:background .8s,border-color .8s;
}
.flip-thumb{
  width:22px;height:22px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;font-size:13px;
  background:var(--card);
  transform:translateX(0);transition:transform .45s cubic-bezier(.5,1.6,.4,1);
  box-shadow:0 1px 4px rgba(0,0,0,.25);
}
.site[data-theme="dinner"] .flip-thumb{transform:translateX(25px)}
.flip-label{font-family:"Yomogi",cursive;font-size:.8rem;font-weight:700;color:var(--wine)}
@media(max-width:480px){.flip-label{display:none}}

/* ---------- Hero ---------- */
.hero{
  max-width:1060px;margin:0 auto;text-align:center;position:relative;
  padding:clamp(64px,11vh,110px) 24px 64px;
}
.eyebrow{font-size:.78rem;letter-spacing:.32em;color:var(--basil);margin-bottom:20px;transition:color .8s}
.hero h1{
  font-family:"Italiana",serif;font-weight:400;
  font-size:clamp(3rem,11vw,6.6rem);letter-spacing:.08em;
  color:var(--wine);line-height:1.04;transition:color .8s;
}
.hero h1 span{display:inline-block;animation:popLetter .7s cubic-bezier(.2,1.4,.4,1) both}
@keyframes popLetter{from{opacity:0;transform:translateY(.5em) rotate(6deg)}to{opacity:1;transform:none}}
.kureha{font-family:"Shippori Mincho",serif;font-size:clamp(1.2rem,3.4vw,1.9rem);letter-spacing:.46em;text-indent:.46em;margin-top:10px}
.lead{max-width:33em;margin:30px auto 0;font-size:.94rem}
.stamp{
  display:inline-block;margin-top:34px;
  font-family:"Yomogi",cursive;font-size:clamp(1.1rem,3vw,1.55rem);font-weight:700;
  color:var(--red);border:2.5px solid var(--red);border-radius:50%/42%;
  padding:13px 32px;transform:rotate(-3deg);
  animation:stampIn .55s ease .8s both;transition:color .8s,border-color .8s;
}
@keyframes stampIn{0%{opacity:0;transform:rotate(-3deg) scale(1.7)}65%{opacity:1;transform:rotate(-3deg) scale(.93)}100%{opacity:1;transform:rotate(-3deg) scale(1)}}
.hero-info{
  margin-top:48px;display:flex;justify-content:center;flex-wrap:wrap;
  border-top:1px solid var(--hair);border-bottom:1px solid var(--hair);
}
.hero-info div{padding:13px 26px;font-size:.85rem;border-left:1px solid var(--hair)}
.hero-info div:first-child{border-left:none}
.hero-info b{color:var(--wine);margin-right:.6em;transition:color .8s}
@media(max-width:640px){
  .hero-info{flex-direction:column}
  .hero-info div{border-left:none;border-top:1px solid var(--hair);padding:9px}
  .hero-info div:first-child{border-top:none}
}
.hint{margin-top:26px;font-family:"Yomogi",cursive;font-size:.85rem;color:var(--muted)}
.dd{position:absolute;color:var(--basil);opacity:.85;pointer-events:none;transition:color .8s}
.dd svg{animation:bob 5.5s ease-in-out infinite}
.d1{top:12%;left:5%}.d1 svg{color:var(--red);animation-delay:.2s}
.d2{top:20%;right:6%}.d2 svg{animation-delay:1.1s;animation-duration:6.4s}
.d3{bottom:26%;left:9%}.d3 svg{color:var(--wine);animation-delay:.7s;animation-duration:7s}
.d4{bottom:32%;right:8%}.d4 svg{color:var(--gold);animation-delay:1.7s}
.d5{top:48%;left:14%}.d5 svg{animation-delay:2.2s;animation-duration:8s}
@keyframes bob{0%,100%{transform:translateY(0) rotate(-6deg)}50%{transform:translateY(-13px) rotate(5deg)}}
@media(max-width:760px){.d3,.d5{display:none}.dd svg{transform:scale(.72)}}

/* ---------- ティッカー ---------- */
.ticker{overflow:hidden;white-space:nowrap;border-top:1px solid var(--hair);border-bottom:1px solid var(--hair);padding:11px 0}
.ticker-in{display:inline-block;animation:tick 26s linear infinite}
.ticker:hover .ticker-in{animation-play-state:paused}
.ticker-in i{font-style:normal;font-family:"Yomogi",cursive;font-size:1.02rem;color:var(--wine);margin:0 1.5em;transition:color .8s}
.ticker-in i.latin{font-family:"Italiana",serif;color:var(--basil);letter-spacing:.16em}
@keyframes tick{to{transform:translateX(-50%)}}

/* ---------- セクション共通 ---------- */
section{max-width:1060px;margin:0 auto;padding:74px 24px}
.sec-head{text-align:center;margin-bottom:46px}
.sec-head .latin{font-size:clamp(1.8rem,4.4vw,2.7rem);letter-spacing:.15em;color:var(--wine);transition:color .8s}
.sec-head .jp{display:block;margin-top:5px;font-size:.8rem;letter-spacing:.28em;color:var(--basil);transition:color .8s}
.sec-head::after{content:"";display:block;width:44px;height:1.5px;background:var(--gold);margin:18px auto 0;transition:background .8s}

/* ---------- 写真プレースホルダー ---------- */
.ph{
  background:var(--paper2);border:1.5px dashed var(--line);
  display:flex;flex-direction:column;gap:8px;align-items:center;justify-content:center;
  color:var(--muted);font-size:.8rem;letter-spacing:.1em;text-align:center;
  white-space:pre-line;line-height:1.6;width:100%;
  transition:background .8s,border-color .8s;
}

/* ---------- TOPICS ---------- */
.topics{padding-top:60px}
.car-win{overflow:hidden;border-radius:4px}
.car-track{display:flex;transition:transform .55s cubic-bezier(.6,.05,.2,1)}
.car-slide{
  flex:0 0 100%;
  background:var(--card);border:2px solid var(--line);
  border-radius:200px 14px 190px 14px/14px 190px 14px 200px;
  overflow:hidden;opacity:.45;transform:scale(.96);
  transition:opacity .5s,transform .5s,background .8s,border-color .8s;
}
.car-slide.cur{opacity:1;transform:scale(1)}
.car-slide .ph{border:none;border-bottom:2px solid var(--line);border-radius:0}
.car-body{padding:18px 24px 24px}
.car-tag{
  display:inline-block;font-family:"Yomogi",cursive;font-size:.8rem;font-weight:700;
  color:var(--red);border:1.5px solid var(--red);
  border-radius:100px 6px 100px 6px/6px 90px 6px 90px;
  padding:1px 12px;margin-bottom:8px;transform:rotate(-1.5deg);transition:color .8s,border-color .8s;
}
.car-body h4{font-size:1.08rem;line-height:1.7}
.car-body p{font-size:.86rem;color:var(--muted);margin-top:6px}
.car-nav{display:flex;justify-content:center;align-items:center;gap:10px;margin-top:16px}
.car-dot{width:9px;height:9px;border-radius:50%;border:1.5px solid var(--wine);transition:background .3s,border-color .8s;padding:0}
.car-dot.on{background:var(--wine)}
.car-btn{
  border:1.5px solid var(--wine);color:var(--wine);width:34px;height:34px;border-radius:50%;
  font-size:1.05rem;line-height:1;transition:background .3s,color .3s;
}
.car-btn:hover{background:var(--wine);color:var(--paper)}
.car-bar{height:2px;background:var(--hair);margin-top:14px;border-radius:2px;overflow:hidden}
.car-fill{display:block;height:100%;background:var(--wine);animation:fill 4.5s linear forwards;transition:background .8s}
@keyframes fill{from{width:0}to{width:100%}}

/* ---------- こだわり ---------- */
.about-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:50px;align-items:center}
@media(max-width:820px){.about-grid{grid-template-columns:1fr}}
.about-h{font-size:1.42rem;line-height:2;margin-bottom:20px}
.about-p{font-size:.93rem;margin-bottom:1.1em}
.about-points{margin-top:22px;display:grid;gap:11px;list-style:none}
.about-points li{font-size:.88rem;padding-left:1.6em;position:relative}
.about-points li::before{content:"◆";position:absolute;left:0;top:.5em;color:var(--gold);font-size:.7em;transition:color .8s}
.about-photo{transform:rotate(1.2deg);box-shadow:6px 8px 0 rgba(0,0,0,.12)}

/* ---------- ショートカット ---------- */
.shortcuts{max-width:1060px;margin:0 auto;padding:0 24px 80px;display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
@media(max-width:760px){.shortcuts{grid-template-columns:repeat(2,1fr)}}
.shortcut{
  width:100%;border:2px solid var(--line);background:var(--card);
  border-radius:160px 12px 150px 12px/12px 150px 12px 160px;
  padding:18px 10px;text-align:center;
  font-family:"Yomogi",cursive;font-size:1rem;font-weight:700;
  transition:transform .25s,box-shadow .25s,background .8s,border-color .8s;
}
.shortcut small{display:block;font-weight:400;color:var(--wine);letter-spacing:.13em;font-size:.74rem;margin-top:3px;transition:color .8s}
.shortcut:hover{transform:rotate(-1deg) translateY(-4px);box-shadow:3px 5px 0 rgba(0,0,0,.14)}

/* ---------- お品書き ---------- */
.menu-bg{background:var(--paper2);transition:background .8s}
.paper-card{
  background:#FFFEFA;color:#2C2620;
  border:2.5px solid #2C2620;
  border-radius:255px 18px 225px 18px/18px 225px 18px 255px;
  padding:38px 32px 30px;max-width:860px;margin:0 auto 56px;
  box-shadow:4px 6px 0 rgba(0,0,0,.14);transform:rotate(-.4deg);
}
.paper-title{font-size:2.2rem;color:#1F6FB2;text-align:center;font-weight:600;letter-spacing:.06em}
.paper-time{text-align:center;font-family:"Yomogi",cursive;font-size:.92rem;color:#5A5147;margin-bottom:24px}
.lunch-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
@media(max-width:680px){.lunch-grid{grid-template-columns:1fr}}
.course-box{
  border:2px solid #2C2620;border-radius:160px 12px 170px 12px/12px 165px 12px 160px;
  padding:18px 16px;transition:transform .25s,box-shadow .25s;
}
.course-box:hover{transform:rotate(-1deg) translateY(-4px);box-shadow:3px 5px 0 rgba(0,0,0,.13)}
.c-name{font-family:"Caveat",cursive;font-size:1.45rem;font-weight:600}
.c-price{font-family:"Yomogi",cursive;color:#D2362E;font-size:1.1rem;font-weight:700;white-space:nowrap}
.course-box ul{list-style:none;margin-top:8px}
.course-box li{font-family:"Yomogi",cursive;font-size:.93rem;line-height:1.8;padding-left:1.3em;position:relative}
.course-box li::before{content:"○";position:absolute;left:0;top:.15em;color:#3E4D24;font-size:.8em}
.lunch-sets{margin-top:18px;display:grid;grid-template-columns:1fr 1fr;gap:16px}
@media(max-width:680px){.lunch-sets{grid-template-columns:1fr}}
.set-line{
  border:2px solid #2C2620;border-radius:14px 150px 14px 160px/150px 14px 160px 14px;
  padding:14px 18px;font-family:"Yomogi",cursive;font-size:.95rem;
  display:flex;justify-content:space-between;align-items:center;gap:12px;
  transition:transform .25s;
}
.set-line:hover{transform:rotate(.8deg) scale(1.02)}
.paper-note{margin-top:18px;text-align:center;font-family:"Yomogi",cursive;font-size:.86rem;color:#5A5147}

.chalkboard{
  background:
    radial-gradient(ellipse at 20% 10%,rgba(255,255,255,.05),transparent 50%),
    radial-gradient(ellipse at 80% 90%,rgba(255,255,255,.04),transparent 50%),
    #31453A;
  border:10px solid #6B4A2F;border-radius:6px;
  box-shadow:inset 0 0 40px rgba(0,0,0,.35),0 8px 22px rgba(0,0,0,.3);
  padding:36px 32px 28px;color:#F3EDD8;max-width:860px;margin:0 auto;
}
.board-title{font-size:2.4rem;color:#BFD9EE;text-align:center;font-weight:500;letter-spacing:.1em;text-shadow:0 0 6px rgba(191,217,238,.35)}
.board-time{text-align:center;font-family:"Yomogi",cursive;font-size:.9rem;color:#D9CFA8;margin-bottom:24px}
.chalk-cols{display:grid;grid-template-columns:1fr 1fr;gap:6px 38px}
@media(max-width:680px){.chalk-cols{grid-template-columns:1fr}}
.chalk-cat{
  display:inline-block;font-family:"Yomogi",cursive;font-size:1.03rem;font-weight:700;
  border:2px solid;border-radius:120px 8px 120px 8px/8px 110px 8px 110px;
  padding:1px 15px;margin:16px 0 9px;transform:rotate(-1.2deg);
}
.chalk-cat.y{color:#F2D26B;border-color:#F2D26B}
.chalk-cat.p{color:#F2A8C4;border-color:#F2A8C4}
.chalk-item-wrap{transition-duration:.5s}
.chalk-item{display:flex;align-items:baseline;gap:8px;font-family:"Yomogi",cursive;font-size:.94rem;line-height:1.65;margin-bottom:7px}
.chalk-item .dots{flex:1;min-width:14px;border-bottom:1px dotted rgba(243,237,216,.45);transform:translateY(-5px)}
.chalk-item .price{color:#F2A8C4;white-space:nowrap}
.chalk-item:hover .price{color:#FFD9E8;text-shadow:0 0 8px rgba(242,168,196,.5)}
.board-note{margin-top:20px;text-align:center;font-family:"Yomogi",cursive;font-size:.86rem;color:#D9CFA8}
.sample-note{text-align:center;margin-top:28px;font-family:"Yomogi",cursive;font-size:.92rem;color:var(--muted)}

/* ---------- 写真ギャラリー ---------- */
.gallery{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}
@media(max-width:820px){.gallery{grid-template-columns:repeat(2,1fr)}}
@media(max-width:520px){.gallery{grid-template-columns:1fr}}
.polaroid{
  background:#fff;color:#2C2620;padding:11px 11px 42px;position:relative;cursor:zoom-in;
  box-shadow:0 4px 14px rgba(0,0,0,.16);
  transition:transform .3s,box-shadow .3s;
}
.rv:nth-child(odd) .polaroid{transform:rotate(-1.6deg)}
.rv:nth-child(even) .polaroid{transform:rotate(1.4deg)}
.polaroid:hover{transform:rotate(0) scale(1.03);box-shadow:0 12px 26px rgba(0,0,0,.24);z-index:2}
.polaroid figcaption{position:absolute;left:0;right:0;bottom:9px;text-align:center;font-family:"Yomogi",cursive;font-size:.9rem}
.polaroid .ph{color:#8A8276;border-color:rgba(44,38,32,.35);background:#F3EBDC}

/* ---------- ライトボックス ---------- */
.lb{
  position:fixed;inset:0;z-index:160;background:rgba(20,14,10,.78);
  display:flex;align-items:center;justify-content:center;padding:22px;
  animation:fadeUp .25s ease;
}
.lb-card{
  background:#fff;color:#2C2620;padding:14px 14px 52px;max-width:560px;width:100%;
  position:relative;box-shadow:0 24px 60px rgba(0,0,0,.5);
  animation:lbIn .35s cubic-bezier(.3,1.4,.4,1);
}
@keyframes lbIn{from{transform:scale(.8) rotate(-3deg);opacity:0}to{transform:scale(1) rotate(-1deg);opacity:1}}
.lb-card{transform:rotate(-1deg)}
.lb-card figcaption{position:absolute;left:0;right:0;bottom:14px;text-align:center;font-family:"Yomogi",cursive;font-size:1.05rem}
.lb-card .ph{color:#8A8276;background:#F3EBDC;border-color:rgba(44,38,32,.35)}
.lb-x{
  position:absolute;top:-14px;right:-14px;width:36px;height:36px;border-radius:50%;
  background:#6E2227;color:#FBF7EE;font-size:1.2rem;line-height:1;
  box-shadow:0 4px 10px rgba(0,0,0,.4);
}

/* ---------- お知らせ ---------- */
.news-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:50px}
@media(max-width:820px){.news-grid{grid-template-columns:1fr}}
.news-list{list-style:none}
.news-list li{display:flex;gap:20px;align-items:baseline;padding:17px 4px;border-bottom:1px solid var(--hair);font-size:.92rem}
.news-list time{color:var(--wine);letter-spacing:.06em;white-space:nowrap;font-size:.95rem;transition:color .8s}
.sns-box{border:1.5px solid var(--hair);background:var(--paper2);padding:32px 28px;text-align:center;transition:background .8s,border-color .8s}
.sns-box p{font-size:.88rem;margin-bottom:20px}
.btn{
  display:inline-block;border:1.5px solid var(--wine);color:var(--wine);
  text-decoration:none;padding:11px 32px;font-size:.85rem;letter-spacing:.18em;
  margin:5px;transition:background .3s,color .3s,border-color .8s;
}
.btn:hover{background:var(--wine);color:var(--paper)}

/* ---------- アクセス ---------- */
.access-grid{display:grid;grid-template-columns:1fr 1fr;gap:50px;align-items:start}
@media(max-width:820px){.access-grid{grid-template-columns:1fr}}
.access-dl{font-size:.92rem}
.access-dl dt{font-size:.75rem;letter-spacing:.24em;color:var(--basil);margin-top:20px;transition:color .8s}
.access-dl dt:first-child{margin-top:0}
.access-dl dd a{color:var(--wine);transition:color .8s}

/* ---------- フッター ---------- */
footer{
  background:var(--wine-deep);color:#F3E9DB;text-align:center;
  padding:50px 24px 42px;margin-top:36px;transition:background .8s;
}
footer .latin{font-size:1.65rem;letter-spacing:.13em;color:#fff}
footer .hand{display:block;margin:12px 0 24px;font-family:"Yomogi",cursive;font-size:1.02rem;color:#E4B95F}
footer small{font-size:.76rem;letter-spacing:.12em}

@media(prefers-reduced-motion:reduce){
  *,*::before,*::after{animation:none!important;transition:none!important}
  .rv{opacity:1!important;transform:none!important}
  .intro{display:none}
}
`}</style>
  );
}
