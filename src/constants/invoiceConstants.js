export const SELLER = {
  name: "INDIA DIGITAL",
  brand: "FOTON POWER",

  logo: "https://res.cloudinary.com/djtva6hec/image/upload/v1767036287/miray/media/qopxsngt9pusq1bohaif.png", // update if new logo
  signature: "", // not required (as per input)

  address:
    "Shop No.111, First Floor, Neelam Market, Kajanchi Gali, Dariba Bazar, Chandni Chowk",
  city: "Delhi",
  state: "Delhi",
  country: "India",
  pincode: "110006",

  // ✅ useful for GST logic later
  stateCode: "07",

  phone: "+91 9958360349",
  email: "akshat14goel@gmail.com",
  website: "",

  gstin: "07AEFPG9185B1ZK",
  pan: "AEFPG9185B",

  currency: "INR",
  defaultGst: 18, // ✅ updated
};

export const DOCUMENT_TYPES = {
  INVOICE: "invoice",
  PACKING: "packing",
};

export const PAYMENT_LABELS = {
  cod: "Cash on Delivery",
  razorpay: "Online Payment",
  prepaid: "Prepaid",
  upi: "UPI",
  bank_transfer: "Bank Transfer",
  not_applicable: "Not Applicable",
};

export const INVOICE_SETTINGS = {
  pricesIncludeGst: true, // ✅ confirmed inclusive
  showSku: true,
  showHsn: false,
  showDiscount: true,
  showShipping: true,

  footerNote:
    "This is a computer generated invoice and does not require a physical signature.",

  terms: [
    "Goods once sold will not be taken back or exchanged.",
    "All disputes are subject to Delhi jurisdiction only.",
  ],
};

export const PACKING_SLIP_SETTINGS = {
  showSku: true,
  showBarcode: false,
  showPrice: false,
};