
function getIsbn() {
  // Kindle
  let pattern1 = /印刷版（ISBN (\d{13})）に基づきます。/;
  for (e of document.getElementsByClassName('a-declarative')) {
    if (e.dataset && e.dataset.aPopover) {
      let result = pattern1.exec(e.dataset.aPopover);
      if (result) {
        return result[1];
      }
    }
  }

  // 文庫
  let pattern2 = /ISBN-13: (\d{3})-(\d{10})/;
  for (e of document.getElementsByClassName('content')) {
    let result = pattern2.exec(e.innerText);
    if (result) {
      return result[1] + result[2];
    }
  }

  console.log("Tachiyomu: 'getIsbn' failed.");
  return null;
}

function getPublisher() {
  let pattern = /出版社: (.+?) \(\d{4}\/\d{1,2}\/\d{1,2}\)/;
  for (e of document.getElementsByClassName('content')) {
    let result = pattern.exec(e.innerText);
    if (result) {
      return result[1];
    }
  }

  console.log("Tachiyomu: 'getPublisher' failed.");
  return null;
}

function insertBrowsing(url) {
  if (!url) {
    console.log("Tachiyomu: 'insertBrowsing' failed.");
    return;
  }

  let outer = document.createElement('span');
  outer.style.display = 'block';
  outer.style.marginTop = '8px';
  outer.style.marginBottom = '16px';
  outer.className = 'a-button';

  let inner = document.createElement('span');
  inner.className = 'a-button-inner';

  let a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.innerText = '試し読みする';
  a.className = 'a-button-text';

  inner.appendChild(a);
  outer.appendChild(inner);

  let e1 = document.getElementById('imageBlockNew_feature_div');
  if (e1) {
    e1.parentElement.insertBefore(outer, e1)
    return;
  }

  let e2 = document.getElementById('booksImageBlock_feature_div');
  if (e2) {
    e2.parentElement.insertBefore(outer, e2)
    return;
  }
}

function main() {
  let isbn = getIsbn();
  let publisher = getPublisher();

  if (!isbn || !publisher) {
    console.log("Tachiyomu: 'main' failed.");
    return;
  }

  switch (publisher) {
    case '講談社':
      chrome.runtime.sendMessage(
        { script: 'kodansha', isbn: isbn },
        url => insertBrowsing(url)
      );
      break;
    case 'KADOKAWA':
      chrome.runtime.sendMessage(
        { script: 'kadokawa', isbn: isbn },
        url => insertBrowsing(url)
      );
      break;
    case '集英社':
      chrome.runtime.sendMessage(
        { script: 'shueisha', isbn: isbn },
        url => insertBrowsing(url)
      );
      break;
    case 'SBクリエイティブ':
      chrome.runtime.sendMessage(
        { script: 'sbcr', isbn: isbn },
        url => insertBrowsing(url)
      );
      break;
    case '小学館':
      chrome.runtime.sendMessage(
        { script: 'shogakukan', isbn: isbn },
        url => insertBrowsing(url)
      );
      break;
  }
}

main();