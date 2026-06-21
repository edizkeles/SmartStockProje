const API_BASE_URL = "http://localhost:5000/api/urun";

export const fetchProducts = async () => {
  const res = await fetch(API_BASE_URL);
  if (!res.ok) throw new Error("Ürünler yüklenirken hata oluştu.");
  return res.json();
};

export const addProduct = async (product) => {
  const res = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Ürün eklenirken hata oluştu.");
  }
  return res.json();
};

export const updateProduct = async (id, product) => {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Ürün güncellenirken hata oluştu.");
  }
  return true;
};

export const deleteProduct = async (id) => {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Ürün silinirken hata oluştu.");
  return true;
};

export const updateStock = async (id, newStock) => {
  const res = await fetch(`${API_BASE_URL}/${id}/stok-guncelle`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ yeni_stok: parseFloat(newStock) }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Stok güncellenirken hata oluştu.");
  }
  return true;
};
