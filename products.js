/* ============================================================
   PRODUCTS, RESULTS, REVIEWS  (edit this file to match your real store)
   concern: "acne" | "pigmentation" | "skin"
   type (bottle drawing if no photo): "pump" | "tube" | "dropper" | "jar"
   image: optional product photo path, e.g. "images/serum.jpg"
   NOTE: the products below are SAMPLES. Replace names, prices, actives.
   ============================================================ */
window.PRODUCTS = [
  {
    id: "clear-cleanser", name: "Clear Balance Cleanser", concern: "acne", type: "pump",
    size: "100 ml", price: 449, mrp: 599, badge: "Bestseller", image: "",
    tagline: "Gentle daily cleanse for acne-prone skin",
    desc: "A low-foam, pH-balanced gel cleanser that clears excess oil and congestion without leaving skin tight or stripped.",
    actives: ["Salicylic acid", "Glycerin", "Allantoin"],
    how: "Massage onto damp skin for 30–40 seconds, rinse with lukewarm water. Use AM and PM."
  },
  {
    id: "blemish-gel", name: "Blemish Rescue Gel", concern: "acne", type: "tube",
    size: "30 g", price: 399, mrp: 499, badge: "", image: "",
    tagline: "Targeted treatment for active breakouts",
    desc: "A lightweight gel that helps calm active blemishes and reduce the look of post-acne marks.",
    actives: ["Niacinamide", "Azelaic acid", "Zinc PCA"],
    how: "Apply a thin layer on cleansed skin at night. Start every other night, then build up."
  },
  {
    id: "bright-serum", name: "Brighten Theory Serum", concern: "pigmentation", type: "dropper",
    size: "30 ml", price: 799, mrp: 999, badge: "New", image: "",
    tagline: "Fades dark spots, evens skin tone",
    desc: "A silky daily serum formulated to help fade pigmentation and uneven tone while supporting the skin barrier.",
    actives: ["Tranexamic acid", "Niacinamide", "Vitamin C derivative"],
    how: "Apply 3–4 drops on clean skin in the morning or evening, followed by moisturiser and sunscreen."
  },
  {
    id: "tone-cream", name: "Even Tone Night Cream", concern: "pigmentation", type: "jar",
    size: "50 g", price: 699, mrp: 899, badge: "", image: "",
    tagline: "Overnight repair for uneven tone",
    desc: "A rich-but-breathable night cream that works while you sleep to visibly even out tone and texture.",
    actives: ["Alpha arbutin", "Peptides", "Panthenol"],
    how: "Apply a pea-sized amount to face and neck every night after serum."
  },
  {
    id: "barrier-moist", name: "Barrier Repair Moisturiser", concern: "skin", type: "jar",
    size: "50 g", price: 549, mrp: 699, badge: "Bestseller", image: "",
    tagline: "Strengthens and soothes sensitive skin",
    desc: "A fragrance-free moisturiser that replenishes the skin barrier and keeps hydration locked in all day.",
    actives: ["Ceramides", "Panthenol", "Squalane"],
    how: "Apply on clean skin morning and night. Layer under sunscreen in the morning."
  },
  {
    id: "daily-spf", name: "Daily Shield SPF 50", concern: "skin", type: "tube",
    size: "50 g", price: 499, mrp: 649, badge: "", image: "",
    tagline: "Lightweight, no-white-cast sun protection",
    desc: "The step that makes every other product work better. Broad-spectrum protection that sits invisibly under makeup.",
    actives: ["Broad spectrum UVA/UVB filters", "Niacinamide", "Vitamin E"],
    how: "Apply two finger-lengths as the last step of your morning routine. Reapply every 2–3 hours outdoors."
  }
];

/* Illustrative before/after examples.
   Replace before/after paths only with consented client photos and update the
   section copy to clearly distinguish real client results from illustrations. */
window.RESULTS = [
  { concern: "Acne", weeks: 8, title: "Active acne & marks",
    products: "Clear Balance Cleanser + Blemish Rescue Gel",
    before: "results/case1-before.jpg", after: "results/case1-after.jpg" },
  { concern: "Pigmentation", weeks: 12, title: "Dark spots & uneven tone",
    products: "Brighten Theory Serum + Daily Shield SPF 50",
    before: "results/case2-before.jpg", after: "results/case2-after.jpg" },
  { concern: "Acne scars", weeks: 10, title: "Post-acne marks & texture",
    products: "Blemish Rescue Gel + Even Tone Night Cream",
    before: "results/case3-before.jpg", after: "results/case3-after.jpg" },
  { concern: "Skin health", weeks: 6, title: "Damaged barrier & dullness",
    products: "Barrier Repair Moisturiser + Daily Shield SPF 50",
    before: "results/case4-before.jpg", after: "results/case4-after.jpg" }
];

/* CUSTOMER REVIEWS — add only REAL reviews. Section stays hidden while empty.
   Example: { name: "Riya S.", city: "Jaipur", rating: 5, text: "..." } */
window.REVIEWS = [];