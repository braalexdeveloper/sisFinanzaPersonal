from rest_framework import serializers
from .models import Transaction
from users.serializers import UserSerializer
from users.models import User
from categories.serializers import CategorySerializer
from categories.models import Category
from datetime import datetime
#from django.utils.timezone import localtime

class TransactionSerializer(serializers.ModelSerializer):
    user=UserSerializer(read_only=True)
    user_id=serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        write_only=True,
        source='user'
    )

    category=CategorySerializer(read_only=True)
    category_id=serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        write_only=True,
        source='category'
    )

    date = serializers.DateField(required=False)

    class Meta:
        model=Transaction
        fields=['id','user','user_id','category','category_id','amount','description','type','date']
        extra_kwargs = {
            'date': {'required': False},  # Hace que el campo date sea opcional
        }

  
    
    