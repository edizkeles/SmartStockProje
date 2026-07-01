const API_BASE_URL = "http://localhost:5000/api/urun";
const AUTH_API_URL = "http://localhost:5000/api/auth";
const LOG_API_URL = "http://localhost:5000/api/log";

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

export const loginApi = async (username, password) => {
  const res = await fetch(`${AUTH_API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Kullanıcı adı veya şifre hatalı!");
  }
  return res.json();
};

export const registerApi = async (username, password) => {
  const res = await fetch(`${AUTH_API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Kayıt işlemi başarısız.");
  }
  return res.json();
};

export const fetchLogsApi = async () => {
  const res = await fetch(LOG_API_URL);
  if (!res.ok) throw new Error("İşlem kayıtları yüklenemedi.");
  return res.json();
};

export const addPurchaseLogApi = async (logData) => {
  const res = await fetch(`${LOG_API_URL}/purchase`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(logData)
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Satış kaydı oluşturulamadı.");
  }
  return res.json();
};

export const addStockUpdateLogApi = async (logData) => {
  const res = await fetch(`${LOG_API_URL}/stock-update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(logData)
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Stok güncelleme kaydı oluşturulamadı.");
  }
  return res.json();
};

export const addProductMutationLogApi = async (logData) => {
  const res = await fetch(`${LOG_API_URL}/product-mutation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(logData)
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Ürün işlem kaydı oluşturulamadı.");
  }
  return res.json();
};

export const clearLogsApi = async () => {
  const res = await fetch(LOG_API_URL, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Kayıtlar temizlenemedi.");
  return res.json();
};
