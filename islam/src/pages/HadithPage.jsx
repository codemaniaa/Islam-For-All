// import { useEffect, useState } from "react";
// import axios from "axios"; 
// function HadithPage() {
//   const [hadiths, setHadiths] = useState([]);
//   const [selectedHadith, setSelectedHadith] = useState(null);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);

//   const BASE_URL = "http://127.0.0.1:8000/api/v1/hadith/";

//   // 📖 Fetch Hadith List
//   const fetchHadiths = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${BASE_URL}?page=${page}`);
//       setHadiths(res.data.results);
//       setLoading(false);
//     } catch (error) {
//       console.error(error);
//       setLoading(false);
//     }
//   };

//   // 📖 Fetch Hadith Detail
//   const fetchHadithDetail = async (id) => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${BASE_URL}${id}/`);
//       setSelectedHadith(res.data);
//       setLoading(false);
//     } catch (error) {
//       console.error(error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchHadiths();
//   }, [page]);

//   // 🔙 Back to list
//   const goBack = () => {
//     setSelectedHadith(null);
//   };

//   return (
//     <div style={{
//       padding: "20px",
//       maxWidth: "800px",
//       margin: "auto",
//       fontFamily: "Arial"
//     }}>

//       <h1 style={{ textAlign: "center" }}>📖 Hadith Collection</h1>

//       {loading && <p>Loading...</p>}

//       {/* ========================= */}
//       {/* 📖 DETAIL VIEW */}
//       {/* ========================= */}
//       {selectedHadith ? (
//         <div style={{
//           border: "1px solid #ddd",
//           padding: "20px",
//           borderRadius: "12px",
//           background: "#fff"
//         }}>
//           <button onClick={goBack} style={{ marginBottom: "10px" }}>
//             ⬅ Back
//           </button>

//           <h2>Hadith #{selectedHadith.hadith_number}</h2>

//           <p style={{
//             fontSize: "18px",
//             lineHeight: "1.6"
//           }}>
//             {selectedHadith.text_urdu}
//           </p>

//           <p><b>Narrator:</b> {selectedHadith.narrator}</p>
//           <p><b>Status:</b> {selectedHadith.status}</p>
//           <p><b>Book:</b> {selectedHadith.book?.name}</p>
//         </div>
//       ) : (
//         <>
//           {/* ========================= */}
//           {/* 📖 LIST VIEW */}
//           {/* ========================= */}
//           {hadiths.map((h) => (
//             <div
//               key={h.id}
//               onClick={() => fetchHadithDetail(h.id)}
//               style={{
//                 border: "1px solid #ccc",
//                 margin: "10px 0",
//                 padding: "15px",
//                 borderRadius: "10px",
//                 cursor: "pointer",
//                 background: "#f9f9f9"
//               }}
//             >
//               <h4>📖 Hadith #{h.hadith_number}</h4>
//               <p>{h.text_urdu?.slice(0, 120)}...</p>
//               <small>📚 {h.book?.name}</small>
//             </div>
//           ))}

//           {/* ========================= */}
//           {/* 🔁 PAGINATION */}
//           {/* ========================= */}
//           <div style={{ marginTop: "20px", textAlign: "center" }}>
//             <button
//               onClick={() => setPage(page - 1)}
//               disabled={page === 1}
//               style={{ marginRight: "10px" }}
//             >
//               ⬅ Prev
//             </button>

//             <span>Page {page}</span>

//             <button
//               onClick={() => setPage(page + 1)}
//               style={{ marginLeft: "10px" }}
//             >
//               Next ➡
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default HadithPage;
