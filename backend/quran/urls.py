from django.urls import path
from .views import surah_list, surah_detail, get_ayahs

urlpatterns = [
    path('surahs/', surah_list),
    path('surah/<int:id>/', surah_detail),
   path('ayahs/<int:surah_id>/', get_ayahs)
]