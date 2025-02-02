// Cache DOM queries and use const for immutability
const elements = {
  intro: document.getElementById('intro'),
  iconList: document.getElementById('iconList'),
  scrollAnimation: document.getElementById('scrollAnimation'),
  background: document.getElementById('background'),
  innerPage: document.getElementById('innerPage'),
  typebox: document.getElementById('typeBox')
};

// Constants
const TYPING_DELAY = 150;
const BLINK_INTERVAL = 500;
const SCROLL_LOCK_DELAY = 2800;
const FADE_DELAY = 500;
const PAGE_TRANSITION_DELAY = 1200;
const BACK_TRANSITION_DELAY = 2000;
const JOKE_SCRIPT = 'What do you call a fake noodle?\n\n\nAn impasta!';

// Use requestAnimationFrame for smoother animations
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

class TypeWriter {
  constructor(typeboxElement) {
    this.textArea = typeboxElement.querySelector('.textArea');
    this.blinker = typeboxElement.querySelector('.blinker');
    this.blinkInterval = null;
  }

  startBlinker() {
    this.stopBlinker();
    this.blinkInterval = setInterval(() => {
      if (this.shouldStop()) {
        this.reset();
        return;
      }
      this.blinker.style.opacity = this.blinker.style.opacity === '0' ? '1' : '0';
    }, BLINK_INTERVAL);
  }

  stopBlinker() {
    if (this.blinkInterval) {
      clearInterval(this.blinkInterval);
      this.blinkInterval = null;
    }
  }

  reset() {
    this.textArea.textContent = '';
    this.blinker.style.opacity = '0';
    this.stopBlinker();
  }

  shouldStop() {
    return getComputedStyle(elements.innerPage).display === 'none';
  }

  async typeText(text) {
    this.reset();
    this.startBlinker();

    for (const char of text) {
      if (this.shouldStop()) break;
      await sleep(TYPING_DELAY);
      this.textArea.textContent += char;
    }
  }
}

class PageTransitioner {
  static async goBack() {
    elements.innerPage.classList.remove('fadeIn');
    await sleep(FADE_DELAY);
    elements.background.classList.remove('as_banner');
    
    const elementsToShow = [elements.intro, elements.iconList, elements.scrollAnimation];
    elementsToShow.forEach(e => e.classList.remove('hidden'));
    
    await sleep(BACK_TRANSITION_DELAY);
    elements.innerPage.classList.remove('show');
  }

  static async nextPage(typeWriter) {
    const elementsToHide = [elements.intro, elements.iconList, elements.scrollAnimation];
    elementsToHide.forEach(e => e.classList.add('hidden'));
    
    elements.background.classList.add('as_banner');
    elements.innerPage.classList.add('show');
    
    await sleep(PAGE_TRANSITION_DELAY);
    elements.innerPage.classList.add('fadeIn');
    await typeWriter.typeText(JOKE_SCRIPT);
  }
}

class ScrollHandler {
  constructor() {
    this.isInnerPage = false;
    this.isLocked = false;
    this.touchStartY = 0;
    this.typeWriter = new TypeWriter(elements.typebox);
  }

  init() {
    document.body.addEventListener('touchstart', this.handleTouchStart.bind(this));
    document.body.addEventListener('wheel', this.handleScroll.bind(this), { passive: false });
    document.body.addEventListener('touchmove', this.handleScroll.bind(this), { passive: false });
  }

  handleTouchStart(e) {
    this.touchStartY = e.changedTouches[0].clientY;
  }

  async handleScroll(e) {
    if (this.isLocked) return;
    e.preventDefault();

    const scrollDelta = this.getScrollDelta(e);
    if (!scrollDelta) return;

    this.isLocked = true;
    
    if (scrollDelta > 0) {
      if (!this.isInnerPage) {
        await PageTransitioner.nextPage(this.typeWriter);
        this.isInnerPage = true;
      }
    } else {
      if (this.isInnerPage) {
        await PageTransitioner.goBack();
        this.isInnerPage = false;
      }
    }

    setTimeout(() => this.isLocked = false, SCROLL_LOCK_DELAY);
  }

  getScrollDelta(e) {
    if (e.deltaY !== undefined) return e.deltaY;
    if (e.changedTouches) {
      const touchDelta = this.touchStartY - e.changedTouches[0].clientY;
      this.touchStartY = e.changedTouches[0].clientY;
      return touchDelta;
    }
    return 0;
  }
}

// Initialize on window load
window.addEventListener('load', () => {
  const scrollHandler = new ScrollHandler();
  scrollHandler.init();
});
