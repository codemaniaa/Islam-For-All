import json
import os
from django.core.management.base import BaseCommand
from django.conf import settings
from quran.models import Surah, Ayah


class Command(BaseCommand):
    help = 'Import Quran Data'

    def handle(self, *args, **kwargs):
        file_path = os.path.join(settings.BASE_DIR, 'data', 'quran.json')

        if not os.path.exists(file_path):
            self.stdout.write(self.style.ERROR("❌ quran.json not found"))
            return

        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)

        # Clear old data (optional but recommended)
        Ayah.objects.all().delete()
        Surah.objects.all().delete()

        for surah_data in data:
            surah = Surah.objects.create(
                id=surah_data['id'],
                name=surah_data['name'],
                transliteration=surah_data['transliteration'],
                translation=surah_data['translation'],
                type=surah_data['type'],
                total_verses=surah_data['total_verses']
            )

            for verse in surah_data['verses']:
                Ayah.objects.create(
                    surah=surah,
                    number=verse['id'],
                    text=verse['text'],
                    translation=verse['translation']
                )

        self.stdout.write(self.style.SUCCESS("✅ Quran Imported Successfully"))