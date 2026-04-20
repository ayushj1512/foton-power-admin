import {
  buildContentIds,
  buildContents,
  cleanObject,
  getCurrentUrl,
  getFbc,
  getFbp,
  getItemsCount,
  getItemsValue,
  getProductIdentifier,
  toNumber,
} from "./meta.helpers";

export const buildMetaBasePayload = ({
  eventName,
  eventId,
  customer = {},
  customData = {},
  eventSourceUrl,
  testEventCode,
} = {}) =>
  cleanObject({
    eventName,
    eventId,
    eventSourceUrl: eventSourceUrl || getCurrentUrl(),
    customer: cleanObject(customer),
    customData: cleanObject(customData),
    fbp: getFbp(),
    fbc: getFbc(),
    testEventCode,
  });

export const buildPageViewPayload = ({
  eventId,
  customer,
  eventSourceUrl,
  testEventCode,
} = {}) =>
  buildMetaBasePayload({
    eventName: "PageView",
    eventId,
    customer,
    eventSourceUrl,
    testEventCode,
  });

export const buildViewContentPayload = ({
  eventId,
  customer,
  product = {},
  eventSourceUrl,
  testEventCode,
} = {}) => {
  const productId = getProductIdentifier(product);

  return buildMetaBasePayload({
    eventName: "ViewContent",
    eventId,
    customer,
    eventSourceUrl,
    testEventCode,
    customData: {
      currency: product?.currency || "INR",
      value: toNumber(product?.price, 0),
      content_ids: productId ? [productId] : [],
      content_name: product?.name || "",
      content_category: product?.category || "",
      content_type: "product",
      contents: productId
        ? [
            {
              id: productId,
              quantity: 1,
              item_price: toNumber(product?.price, 0),
            },
          ]
        : [],
    },
  });
};

export const buildAddToCartPayload = ({
  eventId,
  customer,
  product = {},
  quantity = 1,
  eventSourceUrl,
  testEventCode,
} = {}) => {
  const productId = getProductIdentifier(product);
  const qty = toNumber(quantity, 1);
  const price = toNumber(product?.price, 0);

  return buildMetaBasePayload({
    eventName: "AddToCart",
    eventId,
    customer,
    eventSourceUrl,
    testEventCode,
    customData: {
      currency: product?.currency || "INR",
      value: price * qty,
      content_ids: productId ? [productId] : [],
      content_name: product?.name || "",
      content_category: product?.category || "",
      content_type: "product",
      contents: productId
        ? [
            {
              id: productId,
              quantity: qty,
              item_price: price,
            },
          ]
        : [],
    },
  });
};

export const buildInitiateCheckoutPayload = ({
  eventId,
  customer,
  items = [],
  value,
  currency = "INR",
  eventSourceUrl,
  testEventCode,
} = {}) =>
  buildMetaBasePayload({
    eventName: "InitiateCheckout",
    eventId,
    customer,
    eventSourceUrl,
    testEventCode,
    customData: {
      currency,
      value: value ?? getItemsValue(items),
      content_type: "product",
      content_ids: buildContentIds(items),
      contents: buildContents(items),
      num_items: getItemsCount(items),
    },
  });

export const buildPurchasePayload = ({
  eventId,
  customer,
  order = {},
  eventSourceUrl,
  testEventCode,
} = {}) => {
  const items = Array.isArray(order?.items) ? order.items : [];

  return buildMetaBasePayload({
    eventName: "Purchase",
    eventId: eventId || order?.orderNumber,
    customer,
    eventSourceUrl,
    testEventCode,
    customData: {
      currency: order?.currency || "INR",
      value: toNumber(
        order?.value ?? order?.totalAmount ?? order?.finalAmount,
        0
      ),
      order_id: order?.orderNumber || "",
      content_type: "product",
      content_ids: buildContentIds(items),
      contents: buildContents(items),
      num_items: getItemsCount(items),
    },
  });
};