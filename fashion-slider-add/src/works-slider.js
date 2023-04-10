import Swiper, { Parallax } from 'swiper';

export default function createWorksSlider(el) {
  console.log('RUN__sliedr.js');

  // 要素の定義
  const swiperEl = el.querySelector('.swiper');
  let navigationLocked = false;
  let transitionDisabled = false;
  let frameId;

  // アニメーションを中止する関数
  const disableTransitions = ($el) => {
    $el.addClass('is-no-transition');
    transitionDisabled = true;
    cancelAnimationFrame(frameId); //即時関数
    frameId = requestAnimationFrame(() => {
      $el.removeClass('is-no-transition');
      transitionDisabled = false;
      navigationLocked = false;
    });
  };

  // swiper本体の設定
  const worksSlider = new Swiper(swiperEl, {
    // direction: 'vertical',
    // modules: [Parallax],
    loop: true,
    slidesPerView: 1.2,
    centeredSlides: true,
    spaceBetween: 20,
    pagination: {
      el: '.swiper-pagination',
    },
  });
  return worksSlider;
}
