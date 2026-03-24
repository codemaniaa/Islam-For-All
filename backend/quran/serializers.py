from rest_framework import serializers
from .models import Surah, Ayah


class AyahSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ayah
        fields = ['number', 'text', 'translation']


class SurahSerializer(serializers.ModelSerializer):
    verses = AyahSerializer(many=True, read_only=True)

    class Meta:
        model = Surah
        fields = [
            'id',
            'name',
            'transliteration',
            'translation',
            'type',
            'total_verses',
            'verses'
        ]