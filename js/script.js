document.addEventListener(`DOMContentLoaded`, function () {
  // 스크롤 전체 스무스하게 설정
  const scroll = new LocomotiveScroll({
    el: document.querySelector("[data-scroll-container]"),
    smooth: true,
    multiplier: 0.75, // 기본값은 1, 숫자가 크면 스크롤이 더 빠름
  });

  // -----------------------------------------------
  // .bottomimg 객체 스크롤할때 약간씩 위로 올라가게
  const target = document.querySelector(".bottomimg");
  // const campaignImg = document.querySelector(".arket_campaign2");
  const editSection = document.querySelector(".edit");
  const designerContainer = document.querySelector(".designer .container");

  // LocomotiveScroll 이벤트 리스너 사용
  scroll.on("scroll", (instance) => {
    const scrollY = instance.scroll.y; // Locomotive Scroll이 관리하는 스크롤값
    console.log(scrollY);
    const editTop = editSection.offsetTop;
    const designerTop = designerContainer.offsetTop;

    // 현재 스크롤이 .edit ~ .designer .container 사이에 있을 때만
    if (scrollY >= editTop && scrollY <= designerTop) {
      const distance = scrollY - editTop; // .edit 시작점 기준 얼마나 스크롤했는지
      const totalDistance = designerTop - editTop; // 움직일 총 거리
      const movePercent = distance / totalDistance; // 0 ~ 1 사이 값

      const moveY = movePercent * 200; // 이동 범위를 픽셀 단위로 조정 (0 ~ 100px 등)

      target.style.backgroundPositionY = `${-moveY}px`;
    }
  });

  // 텍스트 고정
  gsap.registerPlugin(ScrollTrigger);

  // LocomotiveScroll과 ScrollTrigger 연동
  ScrollTrigger.scrollerProxy("[data-scroll-container]", {
    scrollTop(value) {
      return arguments.length
        ? scroll.scrollTo(value, { duration: 0, disableLerp: true })
        : // disableLerp: true를 주면 애니메이션 보정 없이 바로 이동
          scroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: document.querySelector("[data-scroll-container]").style.transform
      ? "transform"
      : "fixed",
  });

  scroll.on("scroll", ScrollTrigger.update);

  ScrollTrigger.create({
    trigger: ".FlexibleTitle",
    scroller: "[data-scroll-container]", // Locomotive Scroll 쓰니까

    start: "top 70%", // 요소의 상단이 화면의 70% 지점에 닿으면 시작
    end: "bottom+=10 top", // 요소의 하단이 화면의 맨 위에 닿으면 끝 (bottom+=200 으로 하단에서부터 위치조절하시면돼요 은지씨!)
    pin: true,
    pinSpacing: false,
    scrub: true,
    // markers: true, // 미커
  });

  // -----------------------------------------------
  // 메뉴 버튼을 누르면 메뉴 페이지가 나오게
  const menuBtn = document.querySelector(".menu_btn");
  const closeBtn = document.querySelector(".close_btn");
  const menu = document.querySelector(".menu");
  const body = document.body;

  menuBtn.addEventListener("click", () => {
    menu.classList.add("open");
    body.classList.add("no-scroll"); // 스크롤 막기
  });

  closeBtn.addEventListener("click", () => {
    menu.classList.remove("open");
    body.classList.remove("no-scroll"); // 스크롤 풀기
  });

  // -----------------------------------------------
  // 스크롤 방향에 따라 헤더 숨김/보임
  let lastScroll = 0;
  const logo = document.querySelector(".header_logo");
  let ticking = false;

  scroll.on("scroll", (instance) => {
    const currentScroll = instance.scroll.y;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollDiff = currentScroll - lastScroll;

        if (scrollDiff > 20 && currentScroll > 50) {
          // 꽤 많이 아래로 내렸을 때만 로고 숨김
          logo.classList.add("scroll-hide");
        } else if (scrollDiff < -20) {
          // 꽤 많이 위로 올렸을 때만 로고 보여줌
          logo.classList.remove("scroll-hide");
        }

        lastScroll = currentScroll;
        ticking = false;
      });

      ticking = true;
    }
  });

  // -----------------------------------------------
  // 스크롤 시 로고, 메뉴 버튼이 메인배너 아래로 내렸을때 컬러 바뀌게
  const header = document.querySelector(".header_area");
  const banner = document.querySelector(".banner");

  scroll.on("scroll", (instance) => {
    const scrollY = instance.scroll.y;
    const bannerHeight = banner.offsetHeight;

    if (scrollY > bannerHeight) {
      header.classList.add("dark");
    } else {
      header.classList.remove("dark");
    }
  });

  // -----------------------------------------------
  // 상단이동 TOP 버튼
  const scrollBtn = document.querySelector(".scroll_top_btn");

  if (scrollBtn) {
    // 클릭 이벤트
    scrollBtn.addEventListener("click", () => {
      scroll.scrollTo(0, {
        duration: 1000,
        disableLerp: true,
      });
    });

    // 스크롤 이벤트로 show/hide
    scroll.on("scroll", (instance) => {
      const scrollY = instance.scroll.y;

      if (scrollY > 300) {
        scrollBtn.classList.add("visible");
      } else {
        scrollBtn.classList.remove("visible");
      }
    });
  }
});
