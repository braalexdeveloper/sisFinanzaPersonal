from rest_framework.viewsets import ModelViewSet
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Category
from .serializers import CategorySerializer

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 5  # Número de elementos por página
    page_size_query_param = 'page_size'  # Parámetro para cambiar el tamaño de la página
    max_page_size = 100  # Tamaño máximo de la página

class CategoryViewSet(ModelViewSet):
    queryset=Category.objects.all().order_by('-id')
    serializer_class=CategorySerializer
    permission_classes=[IsAuthenticated]
    pagination_class=StandardResultsSetPagination

    

    def create(self, request, *args, **kwargs):
        serializer=self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        response_data={
            "message":"Categoria creada correctamente!",
            "category":serializer.data
        }

        return Response(response_data,status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        partial=kwargs.pop('partial',False)
        instance=self.get_object()
        serializer=self.get_serializer(instance,data=request.data,partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        response_data={
            "message":"Categoria actualizada correctamente!",
            "category":serializer.data
        }

        return Response(response_data,status=status.HTTP_200_OK)
    
    def destroy(self, request, *args, **kwargs):
        instance=self.get_object()
        self.perform_destroy(instance)
        response_data={
            "message":"Categoria eliminado correctamente!"
        }

        return Response(response_data,status=status.HTTP_204_NO_CONTENT)