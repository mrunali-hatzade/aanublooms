# 🌸 AanuBlooms - Handcrafted Blooms & Everlasting Floral Boutique

A boutique, full-stack handmade forever floral and keepsake e-commerce web application tailored specifically for selling handcrafted forever floral bouquets, blossom pots, plush companions, home decor, custom commissions, and artisan gift pieces.

---

## ✨ Key Features

1. **Artisan Aesthetics & Branding**:
   - Palette inspired by natural yarn tones: Blush pink, warm creams, terracotta, and sage green.
   - **Daylight & Cozy Moonlight Dark Mode** toggle.
   - Craft badges (*100% Hand-stitched*, *⏱️ Handcrafted in ~4-24h*, *OEKO-TEX Certified Eco-Yarn*).

2. **Catalog & Discovery**:
   - 6 categories: Forever Blooms & Pots, Amigurumi Plushies, Bags & Accessories, Wearables & Cardigans, Cozy Home & Living, and DIY Kits & Patterns.
   - Dynamic real-time search with instant auto-suggestions.
   - Multi-criteria filter sidebar: Category, Price range slider ($5 - $150), Yarn Material filter (*Milk Cotton, Chenille Velvet, Organic Cotton, Merino Wool*), Craft Difficulty filter, and In-Stock toggle.
   - Grid and List view switcher + Sort options (Featured, Price Low-High, Price High-Low, Customer Rating, Newest).

3. **Interactive Product Details**:
   - Multi-angle high-resolution image gallery with smooth mouse zoom to inspect stitches.
   - Color swatch picker with stock availability & size/stem bundle selector.
   - Tabbed specs: Story & Description, Yarn Specifications & Dimensions, Washing & Care Guide, Customer Reviews breakdown with "Write a Review" modal.

4. **Bespoke Custom Order / Commission Builder**:
   - Step 1: Select Piece Type (Custom Forever Bouquet, Custom Plushie, Custom Hexagon Cardigan, Custom Daisy Tote).
   - Step 2: Custom Yarn Palette Picker (1 to 4 colors), Flower varieties selection, and Silk Ribbon Custom Inscription.
   - Step 3: Live cost estimate and options to either **Add Custom Commission Directly to Basket** or **Send Inquiry to Artisan Aanu**.

5. **Cart & Promotional Engine**:
   - Slide-out Cart Drawer with **Free Shipping Progress Meter** (Threshold: $50).
   - Working Promo Codes:
     - `AANU15` — 15% off orders over $30
     - `BLOOM20` — 20% off orders over $60
     - `FREESHIP` — Free craft delivery
     - `WELCOME10` — $10 off your first handmade order over $40
   - **Artisan Gift Wrapping Option** (+$4.99) with expandable personalized handwritten card message.

6. **Multi-Step Checkout & Simulated Payment**:
   - Step 1: Contact & Shipping Address (with quick prefill).
   - Step 2: Craft Delivery (Standard Delivery vs Express Priority Rush).
   - Step 3: Simulated Payment Methods (Visual Credit Card simulator, UPI / QR Scan simulator, PayPal, Cash on Delivery).
   - Instant order placement with celebration confetti.

7. **Live Order Tracking & Printable Receipt**:
   - Visual step-by-step progress timeline:
     - 1. *Order Placed*
     - 2. *🧶 Handcrafting & Stitching (Artisan Aanu hand-stitching with love)*
     - 3. *🌸 Quality & Ribbon Packaging*
     - 4. *📦 Shipped with Tracking Number*
     - 5. *🏡 Delivered & Blooming Forever*
   - Printable / downloadable invoice receipt with printable layout.

8. **Maker Studio Admin Dashboard**:
   - Total Revenue, Total Orders, Average Order Value, and Low Stock metrics.
   - **Order Manager**: Live update customer crafting stages (e.g. from *Placed* $\rightarrow$ *Handcrafting* $\rightarrow$ *Packaging* $\rightarrow$ *Shipped*), updating the customer's live tracking view in real time.
   - **Catalog CRUD**: Add new handcrafted piece with custom photos/pricing/inventory, edit existing items, and delete products.
   - **Bespoke Commission Inquiries**: View custom customer commission requests.
   - **Quick Role Switcher** in user dropdown to toggle between Customer and Artisan Admin instantly.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

### 2. Start Both Backend & Frontend Concurrently
```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)

---

## 🧶 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti.
- **Backend**: Node.js, Express, CORS, Morgan.
- **Storage**: Persistent JSON database (`backend/data/`).
