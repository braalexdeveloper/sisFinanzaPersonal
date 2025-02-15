from django.db import models
from users.models import User
from categories.models import Category
from django.utils import timezone

TYPE_CHOICES=[
    ('ingreso','Ingreso'),
    ('gasto','Gasto'),
]

class Transaction(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    category=models.ForeignKey(Category,on_delete=models.SET_NULL,null=True)
    amount=models.DecimalField(max_digits=10,decimal_places=2)
    description=models.TextField(blank=True)
    type=models.CharField(max_length=10,choices=TYPE_CHOICES)
    date=models.DateField(default=timezone.now)

    def __str__(self):
        return f"Transaction {self.id}: {self.type} - {self.amount}"

