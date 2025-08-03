(function () {
  function getScriptParams() {
    const script = document.currentScript || [...document.getElementsByTagName('script')].pop();
    const src = script.getAttribute('src');
    const url = new URL(src, window.location.origin);
    const params = {};
    for (const [key, value] of url.searchParams.entries()) {
      params[key] = value;
    }
    return params;
  }

  function getPageUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};
    for (const [key, value] of urlParams.entries()) {
      params[key] = value;
    }
    return params;
  }

  async function generateVisitorNameId() {
    const res = await fetch('http://localhost:3000/api/corav2/visitorbook');
    const json = await res.json();
    return json.name;
  }

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + value + ';expires=' + d.toUTCString() + ';path=/';
  }

  (async function () {
    const scriptParams = getScriptParams(); // query params from <script src=...>
    const pageParams = getPageUrlParams();  // query params from current page URL

    let visitorId = getCookie('elforge_visitor_id');
    if (!visitorId) {
      visitorId = await generateVisitorNameId();
      setCookie('elforge_visitor_id', visitorId, 365);
    }

    const data = {
      title: document.title,
      url: window.location.href,
      referer: document.referrer,
      host: window.location.hostname,
      visitorId: visitorId,
      timestamp: new Date().toISOString(),
      scriptData: {...scriptParams},
      urlData : {...pageParams},
      userAgent: navigator.userAgent,
      deviceMemory: navigator.deviceMemory || 'unknown',
      platform: navigator.platform,
      language: navigator.language
    };

    console.log(`corav2`, data);

    fetch('http://localhost:3000/api/corav2/corastats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  })();
})();
