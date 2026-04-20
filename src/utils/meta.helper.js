export const getCookie = (name) => {
  if (typeof document === "undefined") return "";

  const match = document.cookie.match(
    new RegExp(`(^|;\\s*)${name}=([^;]*)`)
  );

  return match ? decodeURIComponent(match[2]) : "";
};

export const getFbp = () => getCookie("_fbp");
export const getFbc = () => getCookie("_fbc");

export const getCurrentUrl = () => {
  if (typeof window === "undefined") return "";
  return window.location.href || "";
};

export const cleanObject = (obj = {}) =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([, value]) =>
        value !== undefined &&
        value !== null &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0)
    )
  );

export const toNumber = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

export const getProductIdentifier = (item = {}) =>
  item?.id || item?.code || item?.productCode || "";

export const buildContents = (items = []) =>
  (Array.isArray(items) ? items : [])
    .map((item) => {
      const id = getProductIdentifier(item);
      if (!id) return null;

      return {
        id,
        quantity: toNumber(item?.quantity, 1),
        item_price: toNumber(
          item?.price ?? item?.sellingPrice ?? item?.finalPrice,
          0
        ),
      };
    })
    .filter(Boolean);

export const buildContentIds = (items = []) =>
  (Array.isArray(items) ? items : [])
    .map((item) => getProductIdentifier(item))
    .filter(Boolean);

export const getItemsValue = (items = []) =>
  (Array.isArray(items) ? items : []).reduce((sum, item) => {
    const price = toNumber(
      item?.price ?? item?.sellingPrice ?? item?.finalPrice,
      0
    );
    const quantity = toNumber(item?.quantity, 1);
    return sum + price * quantity;
  }, 0);

export const getItemsCount = (items = []) =>
  (Array.isArray(items) ? items : []).reduce(
    (sum, item) => sum + toNumber(item?.quantity, 1),
    0
  );