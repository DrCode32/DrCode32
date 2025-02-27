const elements = {
  intro: document.getElementById('intro'),
  iconList: document.getElementById('iconList'),
  background: document.getElementById('background'),
  innerPage: document.getElementById('innerPage'),
  typebox: document.getElementById('typeBox')
};

const TYPING_DELAY = 150;
const BLINK_INTERVAL = 500;
const FADE_DELAY = 500;
const PAGE_TRANSITION_DELAY = 1200;
const JOKE_SCRIPT = 'What do you call a fake noodle?\n\nAn impasta!';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

class TypeWriter {
  constructor(typeboxElement) {
    this.textArea = typeboxElement.querySelector('.textArea');
    this.blinker = typeboxElement.querySelector('.blinker');
    this.blinkInterval = null;
    this.textArea.style.whiteSpace = 'pre-line';
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
    clearInterval(this.blinkInterval);
    this.blinkInterval = null;
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

window.addEventListener('load', () => {
  // Auto-show inner page after loading
  const typeWriter = new TypeWriter(elements.typebox);
  
  // Hide intro elements
  [elements.intro, elements.iconList].forEach(e => e.classList.add('hidden'));
  elements.background.classList.add('as_banner');
  elements.innerPage.classList.add('show');
  
  // Trigger fade-in and typing animation
  setTimeout(() => {
    elements.innerPage.classList.add('fadeIn');
    typeWriter.typeText(JOKE_SCRIPT);
  }, PAGE_TRANSITION_DELAY);
});
