const elements = {
  intro: document.getElementById('intro'),
  iconList: document.getElementById('iconList'),
  scrollAnimation: document.getElementById('scrollAnimation'),
  background: document.getElementById('background'),
  innerPage: document.getElementById('innerPage'),
  typebox: document.getElementById('typeBox')
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function startTyping() {
  const script = 'What do you call a fake noodle? \n\n An impasta!';
  const textArea = elements.typebox.querySelector('.textArea');
  const blinker = elements.typebox.querySelector('.blinker');
  
  let blinkInterval = setInterval(() => {
    if (getComputedStyle(elements.innerPage).display === 'none') {
      clearInterval(blinkInterval);
      return;
    }
    blinker.style.opacity = blinker.style.opacity === '1' ? '0' : '1';
  }, 500);

  textArea.innerText = '';
  for (const char of script) {
    if (getComputedStyle(elements.innerPage).display === 'none') break;
    await sleep(150);
    textArea.innerText += char;
  }
}

async function goBack() {
  elements.innerPage.classList.remove('fadeIn');
  await sleep(500);
  elements.background.classList.remove('as_banner');
  
  Object.values(elements).slice(0, 3).forEach(e => e.classList.remove('hidden'));
  await sleep(2000);
  elements.innerPage.classList.remove('show');
}

async function nextPage() {
  Object.values(elements).slice(0, 3).forEach(e => e.classList.add('hidden'));
  elements.background.classList.add('as_banner');
  elements.innerPage.classList.add('show');
  
  await sleep(1200);
  elements.innerPage.classList.add('fadeIn');
  await startTyping();
}

function startScrollTrigger() {
  let isInnerPage = false;
  let touchPos = 0;

  document.body.addEventListener('touchstart', e => touchPos = e.changedTouches[0].clientY);

  function handleScroll(e) {
    e.preventDefault();
    const newTouchPos = e.changedTouches ? e.changedTouches[0].clientY : null;
    const delta = e.deltaY || (newTouchPos ? touchPos - newTouchPos : 0);

    if (delta > 0 && !isInnerPage) {
      nextPage();
      isInnerPage = true;
    } else if (delta < 0 && isInnerPage) {
      goBack();
      isInnerPage = false;
    }
  }

  document.body.addEventListener('wheel', handleScroll, { passive: false });
  document.body.addEventListener('touchmove', handleScroll, { passive: false });
}

window.onload = startScrollTrigger;
