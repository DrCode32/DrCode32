const intro           = document.getElementById('intro'),
      iconList        = document.getElementById('iconList'),
      scrollAnimation = document.getElementById('scrollAnimation'),
      background      = document.getElementById('background'),
      innerPage       = document.getElementById('innerPage'),
      typebox         = document.getElementById('typeBox');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function startTyping() {
  const script    = 'What do you call a fake noodle? \0\0\0\0\0\n\n An impasta!',
        textArea  = typebox.querySelector('.textArea'),
        blinker   = typebox.querySelector('.blinker');

  const interval = setInterval(() => {
    if (getComputedStyle(innerPage).display === 'none') {
      textArea.innerText    = '';
      blinker.style.opacity = '0';
      clearInterval(interval);
    }

    switch (blinker.style.opacity) {
      case '0':
        blinker.style.opacity = '1';
      break;
      default:
        blinker.style.opacity = '0';
      break;
    }
  }, 500);

  textArea.innerText = '';

  for (const char of script) {
    if (getComputedStyle(innerPage).display === 'none') break;

    await sleep(150);
    textArea.innerText += char;
  }
}

async function goBack() {
  innerPage.classList.remove('fadeIn');

  await sleep(500);
  background.classList.remove('as_banner');

  [intro, iconList, scrollAnimation].forEach(e => e.classList.remove('hidden'));

  await sleep(2000);
  innerPage.classList.remove('show');
}

async function nextPage() {
  [intro, iconList, scrollAnimation].forEach(e => e.classList.add('hidden'));

  background.classList.add('as_banner');
  innerPage.classList.add('show');

  await sleep(1200);
  innerPage.classList.add('fadeIn');

  await startTyping();
}

function startScrollTrigger() {
  let isInnerPage = false,
      lock        = false,
      touchPos    = 0;

  document.body.addEventListener('touchstart', e => touchPos = e.changedTouches[0].clientY);

  const listener = e => {
    e.preventDefault();

    if (!lock) {
      lock = true;

      if ((e.deltaY ? e.deltaY : touchPos - e.changedTouches[0].clientY) > 0) {
        if (!isInnerPage) {
          nextPage();
          isInnerPage = true;
        } else {
          lock = false
        }
      } else {
        if (isInnerPage) {
          goBack();
          isInnerPage = false;
        } else {
          lock = false;
        }
      }

      setTimeout(() => lock = false, 2800);
    }
  };

  document.body.addEventListener('wheel', listener, { passive: false });
  document.body.addEventListener('touchmove', listener, { passive: false });
}

window.onload = () => startScrollTrigger();
