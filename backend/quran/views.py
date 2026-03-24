from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Surah, Ayah
from .serializers import SurahSerializer, AyahSerializer


@api_view(['GET'])
def surah_list(request):
    surahs = Surah.objects.all()
    serializer = SurahSerializer(surahs, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def surah_detail(request, id):
    surah = Surah.objects.get(id=id)
    serializer = SurahSerializer(surah)
    return Response(serializer.data)


@api_view(['GET'])
def get_ayahs(request, surah_id):
    ayahs = Ayah.objects.filter(surah_id=surah_id)
    return Response([
        {
            "id": a.id,
            "text": a.text,
            "translation": a.translation
        }
        for a in ayahs
    ])