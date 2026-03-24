from rest_framework import serializers
from .models import Book, Chapter, Hadith


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'


class ChapterSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)

    class Meta:
        model = Chapter
        fields = '__all__'


class HadithSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)
    chapter = ChapterSerializer(read_only=True)

    class Meta:
        model = Hadith
        fields = '__all__'