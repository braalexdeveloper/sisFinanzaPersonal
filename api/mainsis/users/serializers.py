from rest_framework import serializers
from .models import User
from roles.serializers import RoleSerializer
from roles.models import Role

class UserSerializer(serializers.ModelSerializer):
    role=RoleSerializer(read_only=True)
    role_id=serializers.PrimaryKeyRelatedField(
        queryset=Role.objects.all(),
        write_only=True,
        source='role',
        required=False
    )

    password=serializers.CharField(write_only=True,required=True)

    class Meta:
        model=User
        fields=['id','username','email','role','role_id','password','image']


