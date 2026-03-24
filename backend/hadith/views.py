from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from .models import Book, Chapter, Hadith
from .serializers import BookSerializer, ChapterSerializer, HadithSerializer


# 📚 BOOK LIST
class BookList(APIView):
    def get(self, request):
        books = Book.objects.all()
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)


# 📖 CHAPTER LIST
class ChapterList(APIView):
    def get(self, request):
        book_id = request.GET.get('book')

        chapters = Chapter.objects.all()

        if book_id:
            chapters = chapters.filter(book_id=book_id)

        serializer = ChapterSerializer(chapters, many=True)
        return Response(serializer.data)


# 📜 HADITH LIST (WITH FILTERS)
class HadithList(APIView):
    def get(self, request):
        hadiths = Hadith.objects.all()

        # 🔍 Filters
        book_id = request.GET.get('book')
        chapter_id = request.GET.get('chapter')
        status = request.GET.get('status')
        search = request.GET.get('search')

        if book_id:
            hadiths = hadiths.filter(book_id=book_id)

        if chapter_id:
            hadiths = hadiths.filter(chapter_id=chapter_id)

        if status:
            hadiths = hadiths.filter(status__icontains=status)

        if search:
            hadiths = hadiths.filter(text_urdu__icontains=search)

        # 📄 Pagination
        paginator = PageNumberPagination()
        paginator.page_size = 10
        result = paginator.paginate_queryset(hadiths, request)

        serializer = HadithSerializer(result, many=True)
        return paginator.get_paginated_response(serializer.data)


# 📜 SINGLE HADITH
class HadithDetail(APIView):
    def get(self, request, id):
        hadith = Hadith.objects.get(id=id)
        serializer = HadithSerializer(hadith)
        return Response(serializer.data)