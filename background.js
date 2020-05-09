// 講談社
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.script == 'kodansha') {
      fetch('https://bookclub.kodansha.co.jp/search?_sw=' + request.isbn)
        .then(response => response.text())
        .then(text => {
          let e = new DOMParser().parseFromString(text, 'text/html');

          let e1 = e.getElementsByClassName('box');
          if (!e1) {
            console.log("Tachiyomu: 'kodansha' failed.");
            return sendResponse(null);
          }

          let pattern = /<a href="(.+?)" class="btnTry" target="_blank">試し読みする<\/a>/;
          let result = pattern.exec(e1[0].innerHTML);
          if (!result) {
            console.log("Tachiyomu: 'kodansha' failed.");
            return sendResponse(null);
          }

          return sendResponse(result[1]);
        });

      return true;
    }
  });

// KADOKAWA
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.script == 'kadokawa') {
      fetch('https://www.kadokawa.co.jp/product/search/?isbn=' + request.isbn)
        .then(response => response.text())
        .then(text => {
          let e = new DOMParser().parseFromString(text, 'text/html');

          let e1 = e.getElementsByClassName('book-details');
          if (!e1) {
            console.log("Tachiyomu: 'kadokawa' failed.");
            return sendResponse(null);
          }

          let pattern = /<a href="https:\/\/bookwalker\.jp\/(.+?)\/(.+?)" class="btn-basic btn-trial btn-search-result" target="_blank"><i class="ico ico-book"><\/i>試し読みをする<\/a>/;
          let result = pattern.exec(e1[0].innerHTML);
          if (!result) {
            console.log("Tachiyomu: 'kadokawa' failed.");
            return sendResponse(null);
          }

          return sendResponse('https://bookwalker.jp/' + result[1] + '/?sample=1');
        });

      return true;
    }
  });

// 集英社
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.script == 'shueisha') {
      let isbn = request.isbn.substring(0, 3) + '-' + request.isbn.substring(3, 4) + '-' + request.isbn.substring(4, 6) + '-' + request.isbn.substring(6, 12) + '-' + request.isbn.substring(12, 13)
      fetch('https://books.shueisha.co.jp/items/contents.html?isbn=' + isbn)
        .then(response => response.text())
        .then(text => {
          let e = new DOMParser().parseFromString(text, 'text/html');

          let e1 = e.getElementsByClassName('tms-btn');
          if (!e1) {
            console.log("Tachiyomu: 'shueisha' failed.");
            return sendResponse(null);
          }

          let pattern = /<a class="tms-btn".*?href="(.+?)">試し読み<\/a>/;
          let result = pattern.exec(e1[0].outerHTML);
          if (!result) {
            console.log("Tachiyomu: 'shueisha' failed.");
            return sendResponse(null);
          }

          if (result[1].startsWith('//')) {
            // https://books.shueisha.co.jp/
            return sendResponse('https:' + result[1]);
          } else {
            // http://r-cbs.mangafactory.jp/
            return sendResponse(result[1]);
          }
        });

      return true;
    }
  });

// SBクリエイティブ
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.script == 'sbcr') {
      fetch('https://www.sbcr.jp/search/?s=' + request.isbn)
        .then(response => response.text())
        .then(text => {
          let e = new DOMParser().parseFromString(text, 'text/html');
          let e1 = e.getElementsByClassName('article-box');
          if (!e1) {
            console.log("Tachiyomu: 'sbcr' failed.");
            return sendResponse(null);
          }

          let e2 = e1[0].getElementsByClassName('btnbox');
          if (!e2) {
            console.log("Tachiyomu: 'sbcr' failed.");
            return sendResponse(null);
          }

          let pattern = /<a href="(.+?)" target="_blank" rel="noopener noreferrer">電子版を試読<\/a>/;
          let result = pattern.exec(e2[0].outerHTML);
          if (!result) {
            console.log("Tachiyomu: 'sbcr' failed.");
            return sendResponse(null);
          }

          return sendResponse(result[1]);
        });

      return true;
    }
  });

// 小学館
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.script == 'shogakukan') {
      fetch('https://www.shogakukan.co.jp/search/site/' + request.isbn)
        .then(response => response.text())
        .then(text => {
          let e = new DOMParser().parseFromString(text, 'text/html');

          let e1 = e.getElementsByClassName('bookBoxIn01');
          if (!e1) {
            console.log("Tachiyomu: 'shogakukan' failed.");
            return sendResponse(null);
          }

          let e2 = e1[0].getElementsByClassName('tame-box');
          if (!e2) {
            console.log("Tachiyomu: 'shogakukan' failed.");
            return sendResponse(null);
          }

          let pattern = /<a href="https:\/\/shogakukan\.tameshiyo\.me\/\d{13}" target="_blank">/;
          let result = pattern.exec(e2[0].outerHTML);
          console.log(result);
          if (!result) {
            console.log("Tachiyomu: 'shogakukan' failed.");
            return sendResponse(null);
          }

          return sendResponse('https://shogakukan.tameshiyo.me/' + request.isbn);
        });

      return true;
    }
  });
