from django.urls import path
from .views import BookList, ChapterList, HadithList, HadithDetail
 
urlpatterns = [
    path('books/', BookList.as_view()),
    path('chapters/', ChapterList.as_view()),
    path('', HadithList.as_view()),
    path('<int:id>/', HadithDetail.as_view()),
]