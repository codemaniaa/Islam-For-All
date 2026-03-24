import React, { useEffect, useState } from "react";
import { getSurahs, getAyahs } from "../api/quran";

export default function QuranPage() {
  const [surahs, setSurahs] = useState([]);
  const [ayahs, setAyahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(null);

  // Load Surahs
  useEffect(() => {
    getSurahs().then(data => setSurahs(data));
  }, []);

  // Open Surah
  const openSurah = async (id) => {
    const data = await getAyahs(id);
    setAyahs(data);
    setSelectedSurah(id);
  };

  return (
    <div>
      {!selectedSurah ? (
        surahs.map(s => (
          <div key={s.id} onClick={() => openSurah(s.id)}>
            {s.name}
          </div>
        ))
      ) : (
        <div>
          <button onClick={() => setSelectedSurah(null)}>Back</button>

          {ayahs.map(a => (
            <p key={a.id}>{a.text}</p>
          ))}
        </div>
      )}
    </div>
  );
}