const elements = {
  intro: document.getElementById('intro'),
  iconList: document.getElementById('iconList'),
  scrollAnimation: document.getElementById('scrollAnimation'),
  background: document.getElementById('background'),
  innerPage: document.getElementById('innerPage'),
  typebox: document.getElementById('typeBox')
};

const { intro, iconList, scrollAnimation, background, innerPage, typebox } = elements;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeText(text, element) {
  element.innerHTML = '';
  for (const char of text) {
    if (getComputedStyle(innerPage).display === 'none') break;
    await sleep(150);
    element.innerHTML += (char === '\n') ? '<br>' : char;
  }
}

async function startTyping() {
  const script = 'What do you call a fake noodle? \n\n An impasta!';
  const textArea = typebox.querySelector('.textArea');
  const blinker = typebox.querySelector('.blinker');

  const interval = setInterval(() => {
    if (getComputedStyle(innerPage).display === 'none') {
      textArea.innerHTML = '';
      blinker.style.opacity = '0';
      clearInterval(interval);
    }
    blinker.style.opacity = blinker.style.opacity === '0' ? '1' : '0';
  }, 500);

  await typeText(script, textArea);
}

async function changePageState(show) {
  if (show) {
    [intro, iconList, scrollAnimation].forEach(e => e.classList.add('hidden'));
    background.classList.add('as_banner');
    innerPage.classList.add('show');
    await sleep(1200);
    innerPage.classList.add('fadeIn');
    await startTyping();
  } else {
    innerPage.classList.remove('fadeIn');
    await sleep(500);
    background.classList.remove('as_banner');
    [intro, iconList, scrollAnimation].forEach(e => e.classList.remove('hidden'));
    await sleep(2000);
    innerPage.classList.remove('show');
  }
}

function handleScroll(event, isInnerPage, setInnerPage) {
  event.preventDefault();
  if (!this.lock) {
    this.lock = true;
    const delta = event.deltaY ? event.deltaY : this.touchPos - event.changedTouches[0].clientY;
    if (delta > 0 && !isInnerPage) {
      changePageState(true);
      setInnerPage(true);
    } else if (delta <= 0 && isInnerPage) {
      changePageState(false);
      setInnerPage(false);
    }
    setTimeout(() => this.lock = false, 2800);
  }
}

function startScrollTrigger() {
  let isInnerPage = false;
  document.body.addEventListener('touchstart', e => this.touchPos = e.changedTouches[0].clientY);
  const listener = e => handleScroll.call(this, e, isInnerPage, state => isInnerPage = state);
  document.body.addEventListener('wheel', listener, { passive: false });
  document.body.addEventListener('touchmove', listener, { passive: false });
}

window.onload = () => startScrollTrigger();
