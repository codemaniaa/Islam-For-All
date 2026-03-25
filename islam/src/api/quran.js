import axios from "axios";

// ✅ Base API
const API = axios.create({
  baseURL: "https://islam-for-all-production.up.railway.app/api/surahs/",
});

// ==========================
// 📖 QURAN APIs
// ==========================

// 🔹 Get all Surahs
export const getSurahs = async () => {
  try {
    const res = await API.get("surahs/");
    return res.data;
  } catch (error) {
    console.error("Error fetching surahs:", error);
    return [];
  }
};

// 🔹 Get single Surah
export const getSurahDetail = async (id) => {
  try {
    const res = await API.get(`surah/${id}/`);
    return res.data;
  } catch (error) {
    console.error("Error fetching surah detail:", error);
    return null;
  }
};

// 🔹 Get Ayahs of a Surah
export const getAyahs = async (surah_id) => {
  try {
    const res = await API.get(`ayahs/${surah_id}/`);
    return res.data;
  } catch (error) {
    console.error("Error fetching ayahs:", error);
    return [];
  }
};