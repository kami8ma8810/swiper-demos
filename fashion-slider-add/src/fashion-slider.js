import Swiper, { Parallax } from 'swiper';

export default function createFashionSlider(el) {
  // console.log('RUN__fashion-sliderrrrrrrrrr.js');
  const swiperEl = el.querySelector('.swiper');
  let navigationLocked = false;
  let transitionDisabled = false;
  let frameId;

  // アニメーションを中止する
  const disableTransitions = ($el) => {
    $el.addClass('fashion-slider-no-transition');
    transitionDisabled = true;
    cancelAnimationFrame(frameId); //即時関数
    frameId = requestAnimationFrame(() => {
      $el.removeClass('fashion-slider-no-transition');
      transitionDisabled = false;
      navigationLocked = false;
    });
  };

  const initNavigation = (swiper) => {
    // デフォルトのnext/prevクラスを使わずにナビゲーションを動作させる
    swiper.$el.find('.fashion-slider-button-next').on('click', () => {
      if (!navigationLocked) {
        swiper.slideNext();
      }
    });

    swiper.$el.find('.fashion-slider-button-prev').on('click', () => {
      if (!navigationLocked) {
        swiper.slidePrev();
      }
    });
  };

  const destroyNavigation = (swiper) => {
    swiper.$el
      .find('.fashion-slider-button-next, .fashion-slider-button-prev')
      .off('click');
    // ↑swiper.off(event, handler)→イベントを削除
  };

  // Swiper本体の設定
  const fashionSlider = new Swiper(swiperEl, {
    loop: true,
    modules: [Parallax],
    allowTouchMove: false, // no touch swiping
    breakpoints: {
      allowTouchMove: false, // no touch swiping
      // 960: {
      // },
    },
    speed: 1300,
    parallax: true, // text parallax
    on: {
      // 遷移開始時のアニメーション
      transitionStart(swiper) {
        const { slides, previousIndex, activeIndex, $el } = swiper;
        if (!transitionDisabled) navigationLocked = true; // lock navigation buttons
        const $activeSlide = slides.eq(activeIndex);
        const $previousSlide = slides.eq(previousIndex);
        const $previousImageScale = $previousSlide.find(
          '.fashion-slider-scale',
        ); // image wrapper
        const $previousImage = $previousSlide.find('img'); // current image
        const $activeImage = $activeSlide.find('img'); // next image
        const direction = activeIndex - previousIndex;
        const bgColor = $activeSlide.attr('data-slide-bg-color');
        $el.css('background-color', bgColor); // background color animation
        console.log($activeSlide);
        console.log($previousSlide);
        $previousImageScale.transform('scale(0.6)');
        $previousImage.transition(1000).transform('scale(1.2)'); // image scaling parallax
        $previousSlide
          .find('.fashion-slider-title-text')
          .transition(1000)
          .css('color', 'rgba(255,255,255,0)'); // text transparency animation

        $previousImage.transitionEnd(() => {
          $activeImage
            .transition(1300)
            .transform('translate3d(0, 0, 0) scale(1.2)'); // image shift parallax
          $previousImage
            .transition(1300)
            .transform(`translate3d(${60 * direction}%, 0, 0)  scale(1.2)`);
        });
      },
      // 遷移終了時のアニメーション
      transitionEnd(swiper) {
        const { slides, activeIndex, $el } = swiper;
        const $activeSlide = slides.eq(activeIndex);
        const $activeImage = $activeSlide.find('img');

        $activeSlide.find('.fashion-slider-scale').transform('scale(1)');
        $activeImage.transition(1000).transform('scale(1)');
        $activeSlide
          .find('.fashion-slider-title-text')
          .transition(1000)
          .css('color', 'rgba(255,255,255,1)');

        $activeImage.transitionEnd(() => {
          navigationLocked = false;
        });
        // First and last, disable button
        if (activeIndex === 0) {
          $el
            .find('.fashion-slider-button-prev')
            .addClass('fashion-slider-button-disabled');
        } else {
          $el
            .find('.fashion-slider-button-prev')
            .removeClass('fashion-slider-button-disabled');
        }

        if (activeIndex === slides.length - 1) {
          $el
            .find('.fashion-slider-button-next')
            .addClass('fashion-slider-button-disabled');
        } else {
          $el
            .find('.fashion-slider-button-next')
            .removeClass('fashion-slider-button-disabled');
        }
      },
      // 初期化
      init(swiper) {
        // Set initial slide bg color
        const { slides, activeIndex, $el } = swiper;
        // disable initial transition
        disableTransitions($el);
        // set current bg color
        const bgColor = slides.eq(activeIndex).attr('data-slide-bg-color');
        $el.css('background-color', bgColor); // background color animation
        // trigger the transitionEnd event once during initialization
        swiper.emit('transitionEnd');
        // init navigation
        initNavigation(swiper);
      },
      // リサイズ時の処理
      resize(swiper) {
        disableTransitions(swiper.$el);
      },
      // アクティブスライドを削除する
      destroy(swiper) {
        destroyNavigation(swiper);
      },
    },
  });

  return fashionSlider;
}
