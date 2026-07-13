/**
 * Run this in Chrome Console on your Meesho shop page:
 * https://www.meesho.com/Shivbless89364?ms=2
 *
 * It collects all visible products + images and sends them to your website.
 */
(async function importMeeshoShopToShivbless() {
  const WEBSITE = "http://localhost:3000";
  const SHOP_URL = location.href.split("#")[0];

  // Scroll to load more products
  for (let i = 0; i < 8; i++) {
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 700));
  }
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 500));

  const products = [];
  const seen = new Set();

  // Prefer product cards / links
  const cards = Array.from(
    document.querySelectorAll('a[href*="/p/"], [class*="ProductList"], article, li')
  );

  const candidates = cards.length
    ? cards
    : Array.from(document.querySelectorAll("img")).map((img) => img.closest("a") || img.parentElement);

  for (const el of candidates) {
    if (!el) continue;
    const root = el.closest("a") || el;
    const img = root.querySelector("img") || (root.tagName === "IMG" ? root : null);
    if (!img) continue;

    const imageUrl = img.currentSrc || img.src || img.getAttribute("src") || "";
    if (!imageUrl || imageUrl.includes("data:") || imageUrl.length < 10) continue;

    let title =
      img.getAttribute("alt") ||
      root.getAttribute("aria-label") ||
      root.innerText ||
      "";
    title = title
      .replace(/\s+/g, " ")
      .replace(/₹[\d,]+/g, "")
      .replace(/\d+%\s*off/gi, "")
      .trim();

    // Clean common Meesho noise
    title = title.split("\n")[0].trim();
    if (title.length < 4 || title.length > 120) continue;
    if (/follow|sort|filter|price|color|fabric/i.test(title) && title.length < 20) {
      continue;
    }

    const text = (root.innerText || root.textContent || "").replace(/\s+/g, " ");
    const prices = [...text.matchAll(/₹\s*([\d,]+)/g)].map((m) =>
      Number(m[1].replace(/,/g, ""))
    );
    if (!prices.length) continue;

    const price = Math.min(...prices);
    const originalPrice = Math.max(...prices);
    const productUrl = root.href || SHOP_URL;
    const key = `${title}|${price}|${imageUrl}`;
    if (seen.has(key)) continue;
    seen.add(key);

    products.push({
      title,
      price,
      originalPrice,
      imageUrl,
      productUrl: productUrl.startsWith("http") ? productUrl : SHOP_URL,
      rating: 4.2,
    });
  }

  // Fallback: scan all images with nearby price text
  if (products.length < 5) {
    document.querySelectorAll("img").forEach((img) => {
      const imageUrl = img.currentSrc || img.src || "";
      if (!/meesho|images\./i.test(imageUrl)) return;
      const wrap = img.closest("a, div, li, article") || img.parentElement;
      if (!wrap) return;
      const text = (wrap.innerText || "").replace(/\s+/g, " ");
      const prices = [...text.matchAll(/₹\s*([\d,]+)/g)].map((m) =>
        Number(m[1].replace(/,/g, ""))
      );
      let title = (img.alt || text).replace(/\s+/g, " ").trim();
      title = title.replace(/₹[\d,]+/g, "").replace(/\d+%\s*off/gi, "").trim();
      title = title.slice(0, 80);
      if (!title || !prices.length) return;
      const price = Math.min(...prices);
      const key = `${title}|${price}`;
      if (seen.has(key)) return;
      seen.add(key);
      products.push({
        title,
        price,
        originalPrice: Math.max(...prices),
        imageUrl,
        productUrl: wrap.href || SHOP_URL,
        rating: 4.2,
      });
    });
  }

  if (!products.length) {
    alert(
      "No products found. Scroll the product grid fully, then run this script again."
    );
    return;
  }

  console.log("Collected products:", products);

  const res = await fetch(`${WEBSITE}/api/catalog/import-meesho`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ products, shopUrl: SHOP_URL }),
  });

  const data = await res.json();
  if (!data.ok) {
    alert("Import failed: " + (data.error || res.status));
    console.error(data);
    return;
  }

  alert(
    `Success! ${data.count} Meesho products with images imported.\nOpen ${WEBSITE}/shop`
  );
  window.open(`${WEBSITE}/shop`, "_blank");
})();
