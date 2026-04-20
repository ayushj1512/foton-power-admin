samajh gaya bhai — bas path update reh gaya tha + thoda clean bhi kar dete hain.
yeh **final updated README** hai (ready to paste, no bakchodi):

---

# Media Picker (Admin)

Reusable media picker for admin panel — upload + select images/videos.

---

## 📁 Folder Structure

```bash
src/components/media/
  MediaPickerModal.jsx
  MediaGalleryTab.jsx
  MediaUploadTab.jsx
  MediaGrid.jsx
```

---

## ⚡ Features

* Upload (drag / paste / click)
* Media library (images + videos)
* Single & multiple select
* Infinite scroll
* Clean UI (admin ready)

---

## 🧠 Required Store

```js
const {
  items,
  fetchMedia,
  resetMedia,
  loading,
  hasMore,
  uploadMedia,
  uploading,
} = useAdminMediaStore();
```

---

## 📦 Media Object

```js
{
  _id,
  publicId,
  secureUrl,
  url,
  originalName,
  resourceType // image | video
}
```

---

## 🚀 Usage

### Single Select

```jsx
import MediaPickerModal from "@/components/media/MediaPickerModal";

const [open, setOpen] = useState(false);
const [media, setMedia] = useState(null);

<MediaPickerModal
  open={open}
  onClose={() => setOpen(false)}
  onSelect={setMedia}
/>;
```

---

### Multiple Select

```jsx
const [media, setMedia] = useState([]);

<MediaPickerModal
  open={open}
  onClose={() => setOpen(false)}
  onSelect={setMedia}
  multiple
/>;
```

---

## ⚙️ Props

| Prop         | Type    | Default     |
| ------------ | ------- | ----------- |
| open         | boolean | —           |
| onClose      | fn      | —           |
| onSelect     | fn      | —           |
| multiple     | boolean | false       |
| folder       | string  | miray/media |
| resourceType | string  | image       |

---

## 🧾 Example (Product Thumbnail)

```jsx
const [thumb, setThumb] = useState(null);

<MediaPickerModal
  open={open}
  onClose={() => setOpen(false)}
  onSelect={setThumb}
  folder="miray/products"
/>;
```

Save:

```js
thumbnail: {
  url: thumb?.secureUrl,
  publicId: thumb?.publicId,
}
```

---

## 🔄 Upload Flow

* drag / paste / click files
* preview shown
* upload → clears queue

---

## ♾️ Infinite Scroll

* auto loads more on scroll
* uses `hasMore + fetchMedia`

---

## ⚠️ Important

Update imports everywhere:

```js
import MediaPickerModal from "@/components/media/MediaPickerModal";
import MediaGalleryTab from "@/components/media/MediaGalleryTab";
import MediaUploadTab from "@/components/media/MediaUploadTab";
import MediaGrid from "@/components/media/MediaGrid";
```

---

## 🧩 Use Cases

* product images
* category images
* banners
* CMS/media manager

---

## 🧠 Summary

Simple media system:

* upload
* browse
* select
* reuse everywhere

---

agar next level jaana hai to bol:

* folder-wise caching
* search + filter
* tags system (🔥 useful for large catalog)

ready ho to wo bhi bana dete hain.
