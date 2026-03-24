import json

# Load your current file
with open('data/quran.json', encoding='utf-8') as f:
    data = json.load(f)

final_data = []

for surah_key, ayahs in data.items():
    for ayah in ayahs:
        final_data.append({
            "surah": ayah["chapter"],   # same as surah
            "ayah": ayah["verse"],
            "arabic": ayah["text"],
            "english": ""  # empty for now
        })

# Save new file
with open('data/quran_final.json', 'w', encoding='utf-8') as f:
    json.dump(final_data, f, ensure_ascii=False, indent=2)

print("✅ Quran converted successfully!")