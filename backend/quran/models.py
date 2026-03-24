from django.db import models


class Surah(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    transliteration = models.CharField(max_length=100)
    translation = models.CharField(max_length=200)
    type = models.CharField(max_length=20)
    total_verses = models.IntegerField()

    def __str__(self):
        return self.name


class Ayah(models.Model):
    surah = models.ForeignKey(Surah, on_delete=models.CASCADE, related_name='verses')
    number = models.IntegerField()
    text = models.TextField()
    translation = models.TextField()

    def __str__(self):
        return f"{self.surah.name} - {self.number}"