  # Product Selector Component

Reusable product selection component for the admin panel.

Allows admins to visually search and select products using image, title, SKU, and product code instead of manually typing product codes.

---

# Location

```bash
src/components/products/ProductSelector.jsx
```

---

# Features

* Product image preview
* Product title display
* Product code display
* SKU support
* Search by title
* Search by SKU
* Search by product code
* Multi-select
* Remove selected products
* Clear all selections
* Loading state
* Reusable across admin modules

---

# Dependencies

Uses:

```js
import { useAdminProductStore } from "@/store/adminProductStore";
```

Required store fields:

```js
const {
  products,
  fetchProducts,
  isLoading,
} = useAdminProductStore();
```

---

# Expected Product Shape

```js
{
  _id,
  title,
  name,
  productCode,
  sku,
  displayImage,
  image,
  images,
  media
}
```

---

# Props

| Prop        | Type     | Required | Default         |
| ----------- | -------- | -------- | --------------- |
| value       | Array    | Yes      | []              |
| onChange    | Function | Yes      | -               |
| label       | String   | No       | Products        |
| placeholder | String   | No       | Search products |
| disabled    | Boolean  | No       | false           |
| limit       | Number   | No       | 100             |

---

# Returned Value

Component returns only product codes.

Example:

```js
[
  "FOTON-001",
  "FOTON-002",
  "FOTON-003"
]
```

---

# Basic Usage

```jsx
import ProductSelector from "@/components/products/ProductSelector";

const [productCodes, setProductCodes] = useState([]);

<ProductSelector
  value={productCodes}
  onChange={setProductCodes}
/>;
```

---

# Collection Usage

```jsx
<ProductSelector
  label="Collection Products"
  value={form.productCodes}
  onChange={(next) => setField("productCodes", next)}
  disabled={isSubmitting}
/>
```

---

# Category Usage

```jsx
<ProductSelector
  label="Category Products"
  value={form.productCodes}
  onChange={(next) => setField("productCodes", next)}
/>
```

---

# Homepage Featured Products

```jsx
<ProductSelector
  label="Featured Products"
  value={featuredProductCodes}
  onChange={setFeaturedProductCodes}
/>
```

---

# Recommendation Products

```jsx
<ProductSelector
  label="Recommended Products"
  value={recommendedProductCodes}
  onChange={setRecommendedProductCodes}
/>
```

---

# Bundle Products

```jsx
<ProductSelector
  label="Bundle Products"
  value={bundleProductCodes}
  onChange={setBundleProductCodes}
/>
```

---

# Saving Data

Example payload:

```js
const payload = {
  productCodes: form.productCodes || [],
};
```

Example output:

```js
{
  productCodes: [
    "FOTON-001",
    "FOTON-002",
    "FOTON-003"
  ]
}
```

---

# UI Behavior

Selected products show:

* Product image
* Product title
* Product code
* Remove button

Available products show:

* Product image
* Product title
* Product code
* Selection indicator

---

# Search Behavior

Search supports:

```txt
Product Title
Product Code
SKU
```

Examples:

```txt
Sony
SONY-001
CAM-001
Tripod
Lens
```

---

# Why Use This Component

Instead of:

```txt
Manually typing product codes
Copy-pasting SKUs
Remembering product identifiers
```

Admins can:

```txt
Search visually
Confirm image
Confirm title
Select instantly
Avoid mistakes
```

---

# Recommended Use Cases

* Collections
* Categories
* Homepage Sections
* Featured Products
* Recommended Products
* Product Bundles
* Upsell Products
* Cross Sell Products
* Related Products
* Offer Sections
* Landing Pages
* CMS Blocks

---

# Future Improvements

Possible future upgrades:

* Infinite scroll
* Server-side search
* Category filter
* Collection filter
* Brand filter
* Product status filter
* Product badges
* Drag and drop sorting
* Recently selected products
* Favorites
* Virtualized rendering for 10k+ products

---

# Summary

One reusable product selection system for the entire admin panel.

Benefits:

* Visual selection
* Faster workflow
* Less errors
* Reusable everywhere
* Consistent admin experience
* Saves only product codes
* Lightweight integration
