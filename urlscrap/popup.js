function init() {
  console.log("🚀 Extension loaded...");

  const siteClassList = document.getElementById('siteClassList');
  const parentSiteList = document.getElementById('parentSiteList');

  // Ensure storage exists before calling it
  /*if (!chrome.storage || !chrome.storage.local) {
    console.warn("⚠️ chrome.storage.local is not available!");
    return;
  }

  // Load previous options from storage
  chrome.storage.local.get(["siteClasses", "parentSites"], function (data) {
    const classes = data.siteClasses || [];
    const parents = data.parentSites || [];

    classes.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      siteClassList.appendChild(opt);
    });

    parents.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p;
      parentSiteList.appendChild(opt);
    });
  });
*/ 
  const form = document.getElementById('snatchForm');
  if (!form) {
    console.error("❌ Form not found!");
    return;
  }else{
    console.log("Form snatchForm so found ")
  }

  form.method = "POST"; // Just to make sure, although fetch handles it

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    console.log("📝 Form submitted!");

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab || !tab.url) {
        throw new Error("Active tab not found!");
      }

      console.log("📄 Tab info:", tab);

      const site_class = document.getElementById("site_class_input").value.trim();
      const parent_site = document.getElementById("parent_site_input").value.trim();

      const payload = {
        url: tab.url,
        title: tab.title,
        site_class,
        parent_site,
        timestamp: new Date().toISOString()
      };

      const res = await fetch("http://localhost:3000/api/corav2/coraurl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      document.getElementById('status').innerText = "✅ Sent!";
      console.log("📦 Sent payload:", payload);
      console.log("📬 Server response:", result);

      // Save new entries to local storage
     /* chrome.storage.local.get(["siteClasses", "parentSites"], function (data) {
        const siteClasses = new Set(data.siteClasses || []);
        const parentSites = new Set(data.parentSites || []);

        if (site_class) siteClasses.add(site_class);
        if (parent_site) parentSites.add(parent_site);

        chrome.storage.local.set({
          siteClasses: [...siteClasses],
          parentSites: [...parentSites]
        }, () => {
          console.log("💾 Saved new site class and parent site if added.");
        });
      });*/ 

    } catch (err) {
      console.error("❌ Error during submit:", err);
      document.getElementById('status').innerText = "❌ Failed to send.";
    }
  });
}

// Make sure init runs whether DOM is already ready or not
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
