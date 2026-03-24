import json
import os
from django.core.management.base import BaseCommand
from django.conf import settings
from hadith.models import Book, Chapter, Hadith


class Command(BaseCommand):
    help = 'Import Hadith JSON'

    def handle(self, *args, **kwargs):

        # 📂 FILE PATH
        file_path = os.path.join(settings.BASE_DIR, 'data', 'abu-dawood.json')

        if not os.path.exists(file_path):
            self.stdout.write(self.style.ERROR(f"❌ File not found: {file_path}"))
            return

        # 📖 LOAD JSON
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        if 'data' in data:
         hadiths_data = data['data']

        elif 'hadiths' in data:
         hadiths_data = data['hadiths'].get('data', [])

        elif 'hadith' in data:
         hadiths_data = data['hadith'].get('data', [])

        else:
         hadiths_data = []

        print("TOTAL RECORDS FOUND:", len(hadiths_data))

        # 📚 CREATE BOOK
        book_obj, _ = Book.objects.get_or_create(
            name="Sunan Abu Dawood",
            defaults={"writer": "Imam Abu Dawood"}
        )

        # 📖 CREATE CHAPTERS (auto)
        chapter_map = {}

        for h in hadiths_data:
            ch = h.get('chapter', {})

            ch_id = ch.get('id')

            if ch_id and ch_id not in chapter_map:
                chapter = Chapter.objects.create(
                    chapter_number=ch.get('chapterNumber') or 0,
                    english=ch.get('chapterEnglish', ''),
                    urdu=ch.get('chapterUrdu', ''),
                    arabic=ch.get('chapterArabic', ''),
                    book=book_obj
                )
                chapter_map[ch_id] = chapter

        # 📜 CREATE HADITHS
        count = 0

        for h in hadiths_data:
            try:
                ch = h.get('chapter', {})
                chapter_obj = chapter_map.get(ch.get('id'))

                if not chapter_obj:
                    continue

                Hadith.objects.create(
                    hadith_number=h.get('hadithNumber'),

                    narrator=h.get('urduNarrator'),

                    text_urdu=h.get('hadithUrdu', ''),
                    text_arabic=h.get('hadithArabic', ''),
                    text_english=h.get('hadithEnglish', ''),

                    heading_arabic=h.get('headingArabic'),

                    status=h.get('status', 'unknown'),

                    book=book_obj,
                    chapter=chapter_obj
                )

                count += 1

                if count % 500 == 0:
                    self.stdout.write(f"✔ Imported {count} hadiths...")

            except Exception as e:
                self.stdout.write(self.style.WARNING(f"⚠️ Error: {e}"))

        self.stdout.write(self.style.SUCCESS(f"\n✅ TOTAL IMPORTED: {count} HADITHS"))
        print("FULL JSON KEYS:", data.keys())
        print("DATA SAMPLE:", str(data)[:500])