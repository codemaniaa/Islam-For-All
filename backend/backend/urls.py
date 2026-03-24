from django.http import HttpResponse
from django.urls import path, include

def test(request):
    return HttpResponse("API WORKING")
urlpatterns = [
   path('test/', test),
   path('api/', include('quran.urls')), 
    path('api/v1/hadith/', include('hadith.urls')),
    path('api/hadith/', include('hadith.urls')),
]

 