from django.db import models
class Book(models.Model):
    name = models.CharField(max_length=200)
    writer = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return self.name


# 📖 CHAPTER MODEL
class Chapter(models.Model):
    chapter_number = models.IntegerField(default=0)

    english = models.TextField()
    urdu = models.TextField(null=True, blank=True)
    arabic = models.TextField(null=True, blank=True)

    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='chapters')

    def __str__(self):
        return f"{self.chapter_number} - {self.english}"


# 📜 HADITH MODEL
class Hadith(models.Model):
    hadith_number = models.IntegerField(default=0)
    english_number = models.IntegerField(null=True, blank=True)

    narrator = models.CharField(max_length=255, null=True, blank=True)

    text_urdu = models.TextField()
    text_arabic = models.TextField(null=True, blank=True)
    text_english = models.TextField(null=True, blank=True)

    heading_arabic = models.TextField(null=True, blank=True)

    status = models.CharField(max_length=50, default="unknown")

    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='hadiths')
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name='hadiths')

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Hadith {self.hadith_number}"