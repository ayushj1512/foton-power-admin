"use client";

export default function CollectionDropdown({ product, collections = [] }) {
  const productCode = String(product?.productCode || "");

  const matchedCollections = collections.filter((collection) =>
    collection?.productCodes?.some((code) => String(code) === productCode)
  );

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        Collections
      </p>

      {matchedCollections.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {matchedCollections.map((item) => (
            <span
              key={item.slug || item.name}
              className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700"
            >
              {item.name}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-3 rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-500">
          Not added to any collection
        </p>
      )}
    </div>
  );
}