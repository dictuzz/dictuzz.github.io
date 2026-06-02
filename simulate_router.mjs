// Simulate what the VitePress router does to resolve /resources/ 
// to a JS chunk path

// This is the hash map from the site
const hashMap = {
  "ai.md": "DVOZxPVZ",
  "audio.md": "C30vIKq9",
  "beginners-guide.md": "FeN_ps0H",
  "index.md": "BvzCL2jk",
  // etc.
};

// Simulate the Ti function (sanitize path)
function Ti(e) {
  return e.replace(/[\u0000-\u001F"#$&*+,:;<=>?[\]^`{|}\u007F]/g, "_").replace(/(^|\/)_+(?=[^/]*$)/, "$1");
}

// Simulate the nu function with our fix
function nu(pathname) {
  let t = pathname.replace(/\.html$/, "");
  t = decodeURIComponent(t);
  t = t.replace(/\/$/, "/index");
  
  const base = "/resources/";
  console.log("  pathname:", pathname);
  console.log("  after html strip & index:", t);
  
  t = Ti(t.slice(base.length).replace(/\//g, "_") || "index") + ".md";
  console.log("  hash map key:", t);
  console.log("  key lowercase:", t.toLowerCase());
  
  const hash = hashMap[t.toLowerCase()];
  console.log("  hash found:", hash || "NOT FOUND");
  
  if (hash) {
    const result = base + "assets/" + t + "." + hash + ".js";
    console.log("  chunk path:", result);
    return result;
  }
  return null;
}

// Simulate the ks function (normalize URL)  
function ks(href) {
  const t = new URL(href, "http://a.com");
  t.pathname = t.pathname.replace(/(^|\/)index(\.html)?$/, "$1");
  // cleanUrls is true, so:
  t.pathname = t.pathname.replace(/\.html$/, "");
  return t.pathname + t.search + t.hash;
}

console.log("=== Testing /resources/ ===");
nu("/resources/");

console.log("\n=== Testing /resources/index ===");
nu("/resources/index");

console.log("\n=== Testing /resources/index.html ===");
nu("/resources/index.html");

console.log("\n=== Testing /resources/ai ===");
nu("/resources/ai");

console.log("\n=== ks() normalization ===");
console.log("ks('/resources/'):", ks("http://a.com/resources/"));
console.log("ks('/resources/index'):", ks("http://a.com/resources/index"));
console.log("ks('/resources/index.html'):", ks("http://a.com/resources/index.html"));

// Now simulate what happens on initial page load
// The router calls: r(l=be?location.href:"/resources/")
// Then ks(l) normalizes it
// Then o(l) calls nu(pathname) where pathname comes from new URL(l, "http://a.com").pathname
console.log("\n=== Simulating initial load of /resources/ ===");
const initialUrl = "https://dictuzz.me/resources/";
const normalized = ks(initialUrl);
console.log("normalized URL:", normalized);
// The router then does: const f = new URL(normalized, "http://a.com")
const routeUrl = new URL(normalized, "http://a.com");
console.log("route pathname:", routeUrl.pathname);
nu(routeUrl.pathname);
