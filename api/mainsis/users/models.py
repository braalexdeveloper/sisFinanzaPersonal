from django.db import models
from django.contrib.auth.models import AbstractUser 
from roles.models import Role

class User(AbstractUser):
    role=models.ForeignKey(Role,on_delete=models.CASCADE,null=True,blank=True)
    image=models.ImageField(upload_to='profile_images/',null=True,blank=True)


    def __str__(self):
        return self.username
