# Tra cứu Địa chỉ Hành chính Hà Nội — Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Build a mobile-first single-page website that lets users look up new administrative addresses in Hanoi after the 2025 ward merger, using a static JSON database embedded in a single HTML file.

**Architecture:** Single HTML file with CSS + JS embedded inline. Data stored as JS objects. Fuzzy search using Vietnamese diacritics normalization. No external dependencies except Google Fonts.

**Tech Stack:** HTML5, CSS3, Vanilla JavaScript, Google Fonts (Inter)

---

### Task 1: Create the ward mapping data (phường cũ → phường mới)

**Files:**
- Create: `data/ward_mapping.json`

**Step 1: Create the JSON data file with all 12 inner-city districts**

Based on research from Nghị quyết 1656/NQ-UBTVQH15, create the mapping:

```json
{
  "ward_mapping": [
    {
      "old_ward": "Quán Thánh",
      "old_district": "Ba Đình",
      "new_ward": "Ba Đình",
      "new_district": "Ba Đình"
    }
  ]
}
```

Complete ward mapping for all 12 districts:

**Quận Hoàn Kiếm** (18 phường cũ → 2 phường mới):
- Hàng Mã, Hàng Bồ, Hàng Đào, Hàng Bạc, Hàng Buồm, Hàng Gai, Lý Thái Tổ, Đồng Xuân, Tràng Tiền, Cửa Đông, Hàng Bông, Hàng Trống → **Hoàn Kiếm**
- Trần Hưng Đạo, Hàng Bài, Phan Chu Trinh, Cửa Nam → **Cửa Nam**

**Quận Ba Đình** (13 phường cũ → 3 phường mới):
- Quán Thánh, Trúc Bạch, Điện Biên → **Ba Đình**
- Vĩnh Phúc, Liễu Giai, Đội Cấn, Cống Vị → **Ngọc Hà**
- Ngọc Khánh, Thành Công, Giảng Võ, Kim Mã → **Giảng Võ**

**Quận Đống Đa** (17 phường cũ → 5 phường mới):
- Láng Hạ, Nam Đồng, Quang Trung, Trung Liệt, Thịnh Quang → **Đống Đa**
- Văn Miếu, Quốc Tử Giám → **Văn Miếu - Quốc Tử Giám**
- Khâm Thiên, Phương Liên, Trung Phụng, Hàng Bột → **Kim Liên**  
- Láng Thượng, Láng Hạ (phần), Ô Chợ Dừa → **Ô Chợ Dừa**
- Cát Linh, Phương Mai, Ngã Tư Sở, Khương Thượng → **Láng**

**Quận Hai Bà Trưng** (18 phường cũ → 3 phường mới):
- Phạm Đình Hổ, Nguyễn Du, Lê Đại Hành, Đồng Nhân, Bùi Thị Xuân, Đống Mác → **Hai Bà Trưng**
- Bạch Mai, Trương Định, Thanh Lương, Thanh Nhàn, Quỳnh Mai, Quỳnh Lôi, Cầu Dền → **Bạch Mai**
- Vĩnh Tuy, Minh Khai, Bách Khoa, Thanh Nhàn (phần) → **Vĩnh Tuy**

**Quận Thanh Xuân** (11 phường cũ → 3 phường mới):
- Thanh Xuân Trung, Thượng Đình, Nhân Chính, Thanh Xuân Bắc → **Thanh Xuân**
- Khương Đình, Hạ Đình, Khương Trung → **Khương Đình**
- Phương Liệt, Khương Mai, Kim Giang → **Phương Liệt**

**Quận Cầu Giấy** (8 phường cũ → 3 phường mới):
- Quan Hoa, Dịch Vọng, Dịch Vọng Hậu → **Cầu Giấy**
- Nghĩa Đô, Nghĩa Tân → **Nghĩa Đô**
- Yên Hòa, Mai Dịch, Trung Hòa → **Yên Hòa**

**Quận Hoàng Mai** (14 phường cũ → 7 phường mới):
- Tương Mai, Tân Mai, Giáp Bát → **Tương Mai**
- Hoàng Văn Thụ, Thịnh Liệt, Đại Kim → **Định Công**
- Định Công → **Định Công**
- Hoàng Liệt, Trần Phú → **Hoàng Liệt**
- Yên Sở → **Yên Sở**
- Vĩnh Hưng, Mai Động → **Vĩnh Hưng**
- Lĩnh Nam, Thanh Trì → **Lĩnh Nam**
- Hoàng Mai (phần Đền Lừ) → **Hoàng Mai**

**Quận Long Biên** (14 phường cũ → 4 phường mới):
- Việt Hưng, Đức Giang, Sài Đồng, Gia Thụy → **Việt Hưng**
- Bồ Đề, Ngọc Thụy, Ngọc Lâm → **Bồ Đề**
- Long Biên, Phúc Đồng, Thạch Bàn → **Long Biên**
- Phúc Lợi, Giang Biên, Cự Khối → **Phúc Lợi**

**Quận Tây Hồ** (8 phường cũ → 2 phường mới):
- Bưởi, Thụy Khuê, Yên Phụ, Quảng An, Tứ Liên → **Tây Hồ**
- Phú Thượng, Nhật Tân, Xuân La → **Phú Thượng**

**Quận Bắc Từ Liêm** (13 phường cũ → 4 phường mới):
- Phú Diễn, Minh Khai → **Phú Diễn**
- Tây Tựu, Thụy Phương → **Tây Tựu**
- Thượng Cát, Liên Mạc, Đông Ngạc → **Thượng Cát**
- Xuân Đỉnh, Cổ Nhuế 1, Cổ Nhuế 2, Phúc Diễn, Xuân Tảo → **Xuân Đỉnh**

**Quận Nam Từ Liêm** (10 phường cũ → 4 phường mới):
- Cầu Diễn, Mỹ Đình 1, Mỹ Đình 2, Phú Đô, Mễ Trì → **Từ Liêm**
- Phương Canh, Xuân Phương → **Xuân Phương**
- Tây Mỗ → **Tây Mỗ**
- Đại Mỗ, Trung Văn → **Đại Mỗ**

**Quận Hà Đông** (17 phường cũ → 5 phường mới):
- Dương Nội, La Khê, Phú Lãm → **Dương Nội**
- Yên Nghĩa, Phúc La → **Yên Nghĩa**
- Phú Lương, Kiến Hưng, Hà Cầu → **Phú Lương**
- Văn Quán, Nguyễn Trãi, Quang Trung (HĐ), Yết Kiêu → **Văn Quán**
- Mộ Lao, Vạn Phúc, Biên Giang → **Mộ Lao**

**Step 2: Verify data structure is valid JSON**

Run: `python -c "import json; json.load(open('data/ward_mapping.json', encoding='utf-8')); print('Valid JSON')"`
Expected: `Valid JSON`

---

### Task 2: Create the street-to-ward data

**Files:**
- Create: `data/streets.json`

**Step 1: Create street data for major streets in all 12 districts**

Start with key streets that people commonly search for. Structure:

```json
{
  "streets": [
    {
      "name": "Nguyễn Ngọc Nại",
      "type": "phố",
      "ward": "Phương Liệt",
      "district": "Thanh Xuân"
    }
  ]
}
```

Include data for approximately 200-300 major streets across 12 inner-city districts. This will be the initial dataset, expandable later.

**Step 2: Verify data structure**

Run: `python -c "import json; d=json.load(open('data/streets.json', encoding='utf-8')); print(f'{len(d[\"streets\"])} streets loaded')"`

---

### Task 3: Build the HTML structure

**Files:**
- Create: `index.html`

**Step 1: Create the HTML file with embedded CSS and JS**

The HTML structure:
```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tra cứu Địa chỉ Hà Nội</title>
  <meta name="description" content="Tra cứu địa chỉ hành chính mới của Hà Nội sau sáp nhập phường 2025">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <div class="container">
    <header>
      <h1>Tra cứu Địa chỉ<br>Hà Nội</h1>
      <p class="subtitle">Địa chỉ hành chính mới sau sáp nhập 2025</p>
    </header>
    
    <div class="search-box">
      <input type="text" id="searchInput" placeholder="Nhập số nhà + tên đường hoặc tên phường cũ..." autocomplete="off">
      <div id="suggestions" class="suggestions hidden"></div>
    </div>
    
    <div id="result" class="result hidden">
      <!-- Result card appears here -->
    </div>
    
    <div class="examples">
      <p>Ví dụ: <span class="example-chip">123 Nguyễn Ngọc Nại</span> <span class="example-chip">phường Khương Trung</span></p>
    </div>
  </div>
</body>
</html>
```

---

### Task 4: Build the CSS (mobile-first, premium design)

**Step 1: Add CSS within `<style>` in index.html**

Key design tokens:
- Primary gradient: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- Background: `#0f0f23` (dark) with gradient overlay
- Card background: `rgba(255,255,255,0.08)` with backdrop-filter blur
- Border radius: `16px` for cards, `12px` for inputs
- Font: Inter
- Shadows: `0 8px 32px rgba(0,0,0,0.3)`
- Animations: fade-in, slide-up for results

Mobile-first responsive:
- Max-width: 480px container
- Touch-friendly: min 48px tap targets
- Safe area padding for notched phones

---

### Task 5: Build the JavaScript logic

**Step 1: Embed the JSON data as JS constants**

```js
const STREETS = [ /* from streets.json */ ];
const WARD_MAPPING = [ /* from ward_mapping.json */ ];
```

**Step 2: Implement Vietnamese text normalization**

```js
function removeDiacritics(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

function normalize(str) {
  return removeDiacritics(str.toLowerCase().trim());
}
```

**Step 3: Implement smart input parsing**

```js
function parseInput(input) {
  // Detect mode: if contains "phường" or "phuong" → ward lookup mode
  // Otherwise → street lookup mode
  // For street mode: extract house number + street name
  // Return { mode, houseNumber, streetName, wardName }
}
```

**Step 4: Implement fuzzy search with scoring**

```js
function searchStreets(query) {
  // Normalize query, compare with normalized street names
  // Score: exact match > starts with > contains
  // Return top 5 matches sorted by score
}

function searchWards(query) {
  // Similar fuzzy search on ward_mapping
  // Return matching old wards with their new ward info
}
```

**Step 5: Implement autocomplete with debounce**

```js
// 200ms debounce on input
// Show suggestion dropdown with matching streets/wards
// Click suggestion to fill input and show result
```

**Step 6: Implement result display**

```js
function showResult(data) {
  // For street mode: "Số {number} {type} {street}, phường {ward}, thành phố Hà Nội"
  // For ward mode: "Phường {old} (cũ) → Phường {new} (mới), quận {district}, thành phố Hà Nội"
  // Include copy button
  // Animate result card in
}
```

**Step 7: Implement copy to clipboard**

```js
function copyResult() {
  navigator.clipboard.writeText(resultText);
  // Show "Đã sao chép!" toast
}
```

**Step 8: Wire up example chips**

```js
// Click on example chips fills the input and triggers search
```

---

### Task 6: Integrate everything into single HTML file

**Files:**
- Modify: `index.html` (embed all data, CSS, and JS)

**Step 1: Combine all parts**

Take the data from Task 1 & 2, embed directly as JS constants in the `<script>` tag. 
Ensure the final file is self-contained with:
- Inline `<style>` with all CSS
- Inline `<script>` with all data + logic
- HTML structure

**Step 2: Test file opens correctly in browser**

Open `index.html` in browser and verify:
- [ ] Page loads without errors
- [ ] Search input is visible and centered
- [ ] Typing shows autocomplete suggestions
- [ ] Selecting a result shows formatted address
- [ ] Copy button works
- [ ] Example chips work
- [ ] Mobile responsive (test with device toolbar)

---

### Task 7: Polish and verify

**Step 1: Test search scenarios**

- Input: "123 nguyễn ngọc nại" → Expected: "Số 123 phố Nguyễn Ngọc Nại, phường Phương Liệt, thành phố Hà Nội"
- Input: "phường Khương Trung" → Expected: shows mapping to phường Khương Đình
- Input: "nguyen ngoc nai" (no diacritics) → Expected: still finds Nguyễn Ngọc Nại
- Input: "hàng mã" → Expected: shows mapping to phường Hoàn Kiếm
- Input: "45 Kim Mã" → Expected: shows correct ward

**Step 2: Test mobile responsiveness**

Use browser device toolbar to test on iPhone SE, iPhone 14, Galaxy S20.

**Step 3: Final visual polish**

- Smooth animations
- Loading states
- Empty state messaging
- Touch feedback on buttons
