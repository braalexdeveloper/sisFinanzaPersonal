from rest_framework_simplejwt.serializers import TokenObtainPairSerializer



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls,user):
        token=super().get_token(user) #Obtiene el token standar jwt

         # Agrega datos personalizados al token
        token['username'] = user.username
        token['email'] = user.email
        token['id'] = user.id
        

        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)  # Obtiene los tokens de acceso y refresh

        # Agrega datos adicionales a la respuesta
        data['username'] = self.user.username
        data['email'] = self.user.email
        data['id'] = self.user.id

        return data
