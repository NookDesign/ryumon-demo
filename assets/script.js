/* =========================================================
   龍門精舎 トップページ（リニューアル提案デモ）
   1. スマホ用メニューの開閉
   2. スクロールに合わせたヘッダー・「上へ戻る」ボタンの表示
   3. 控えめな表示アニメーション
   4. 画像が読み込めなかったときの対策
   5. お問い合わせボタン（デモのため送信しない）
   ========================================================= */
(function () {
  "use strict";

  // JavaScript が動いていることを CSS に伝える（アニメーション用）
  document.documentElement.classList.add("js");

  var header = document.querySelector(".header");
  var menuBtn = document.querySelector(".menu-btn");
  var nav = document.getElementById("global-nav");
  var toTop = document.querySelector(".to-top");
  var pcQuery = window.matchMedia("(min-width: 1100px)");

  /* ---------- 1. スマホ用メニューの開閉 ---------- */
  function setMenu(open) {
    if (!menuBtn || !nav) return;
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.querySelector(".menu-btn__label").textContent = open ? "閉じる" : "メニュー";
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("is-menu-open", open);
    if (open) {
      // 表示が切りかわってからフォーカスを移す（キーボード操作・読み上げ用）
      window.setTimeout(function () {
        var firstLink = nav.querySelector("a");
        if (firstLink) firstLink.focus({ preventScroll: true });
      }, 50);
    }
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
    });

    // メニュー内のリンクを押したら閉じる
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a") && !pcQuery.matches) setMenu(false);
    });

    // Esc キーで閉じる
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setMenu(false);
        menuBtn.focus();
      }
    });

    // PC の幅になったら開いた状態を解除
    var onChange = function (e) { if (e.matches) setMenu(false); };
    if (pcQuery.addEventListener) pcQuery.addEventListener("change", onChange);
    else if (pcQuery.addListener) pcQuery.addListener(onChange);
  }

  /* ---------- 2. スクロールに合わせた表示 ---------- */
  var ticking = false;
  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (header) header.classList.toggle("is-scrolled", y > 10);
    if (toTop) toTop.classList.toggle("is-visible", y > 600);
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  /* ---------- 3. 表示アニメーション ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    reveals.forEach(function (el) { observer.observe(el); });
  } else {
    // 古いブラウザでは最初から表示
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- 4. 画像が読み込めなかったときの対策 ---------- */
  // 壊れた画像のアイコンを出さず、枠（サイズ）だけ残してレイアウトを保つ
  document.querySelectorAll("img").forEach(function (img) {
    function markBroken() { img.classList.add("is-broken"); }
    if (img.complete && img.naturalWidth === 0) markBroken();
    else img.addEventListener("error", markBroken);
  });

  /* ---------- 5. お問い合わせボタン（デモ） ---------- */
  var demoBtn = document.querySelector("[data-demo-contact]");
  var notice = document.getElementById("contact-notice");
  if (demoBtn && notice) {
    demoBtn.addEventListener("click", function () {
      notice.textContent = "このページはデモのため、ご予約・お問い合わせ・お支払いはできません。実際のサイトでは、ここから予約ページやお問い合わせ窓口へご案内します。";
      notice.classList.add("is-highlight");
    });
  }
})();
