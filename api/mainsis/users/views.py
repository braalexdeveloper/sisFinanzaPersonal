from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from .models import User
from roles.models import Role

class UserViewSet(ModelViewSet):
    queryset=User.objects.all()
    serializer_class=UserSerializer
    permission_classes=[IsAuthenticated]

    @action(detail=False,methods=['post'],permission_classes=[AllowAny])
    def register(self,request):
        serializer=self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        #Obtener el rol predeterminado
        try:
            client_role=Role.objects.get(name='Client')
        except Role.DoesNotExist:
            return Response(
                {"error": "El rol 'Client' no está configurado en el sistema."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        #Crear el usuario y crearle el rol automaticamente
        user=serializer.save(role=client_role)

        if 'password' in request.data:
            user.set_password(request.data['password'])
            user.save()

        response_data = {
            "message": "Usuario registrado correctamente",
            "user": serializer.data
        }

        return Response(response_data, status=status.HTTP_201_CREATED)


    def create(self, request, *args, **kwargs):
        serializer=self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user=serializer.save()
        if 'password' in request.data:
            user.set_password(request.data['password'])
            user.save()

            response_data={
            "message":"Usuario creado correctamente",
            "user":serializer.data
            }

            return Response(response_data,status=status.HTTP_201_CREATED)

    def update(self,request,*args,**kwargs):
        partial=kwargs.pop('partial',False)
        instance=self.get_object()
        serializer=self.get_serializer(instance,data=request.data,partial=partial)
        serializer.is_valid(raise_exception=True)
        user=serializer.save()
        if 'password' in request.data:
            user.set_password(request.data['password'])
            user.save()
            response_data={
            "message":"Usuario actualizado correctamente",
            "user":serializer.data
            }

            return Response(response_data,status=status.HTTP_200_OK)
        
    def destroy(self, request, *args, **kwargs):
        instance=self.get_object()
        self.perform_destroy(instance)
        response_data={
            "message":"Usuario eliminado correctamente"
        }

        return Response(response_data,status=status.HTTP_204_NO_CONTENT)


