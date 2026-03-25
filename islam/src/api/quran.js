import axios from "axios";

// ✅ Base API
const API = axios.create({
  baseURL: "https://islam-for-all-production.up.railway.app/api/",
});

// ==========================
// 📖 QURAN APIs
// ==========================

export const getSurahs = async () => {
  try {
    const res = await API.get("surahs/");
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getAyahs = async (id) => {
  try {
    const res = await API.get(`ayahs/${id}/`);
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// ==========================
// 📚 HADITH APIs (NEW)
// ==========================

// 🔹 Get Books
export const getBooks = async () => {
  try {
    const res = await API.get("hadith/books/");
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// 🔹 Get Hadiths
export const getHadiths = async (bookId, page = 1, search = "", status = "") => {
  try {
    const res = await API.get("hadith/", {
      params: {
        book: bookId,
        page: page,
        search: search || undefined,
        status: status || undefined,
      },
    });
    return res.data;
  } catch (error) {
    console.error(error);
    return { results: [] };
  }
};