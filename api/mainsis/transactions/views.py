from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework import status
from .serializers import TransactionSerializer
from .models import Transaction
from django.utils import timezone
from django.db.models import Q
from rest_framework.decorators import action
from django.db.models import Sum
from django.utils.timezone import now
from datetime import timedelta
from django.utils.timezone import localtime

class StandarResultSetTransaction(PageNumberPagination):
    page_size=5
    page_size_query_param='page_size'
    max_page_size=100


class TransactionViewSet(ModelViewSet):
    serializer_class=TransactionSerializer
    permission_classes=[IsAuthenticated]
    pagination_class=StandarResultSetTransaction

    def get_queryset(self):
        # Obtén el ID del usuario desde los parámetros de la URL o el usuario autenticado
        user_id = self.request.query_params.get('user_id', None)
        type=self.request.query_params.get('type',None)
        date=self.request.query_params.get('date',None)
        month=self.request.query_params.get('month',None)

        filters=Q()

        if user_id:
            filters &=Q(user_id=user_id)
        if type:
            filters &=Q(type=type)
        if date:
            filters &=Q(date=date)
        if month:
            #Filtra por mes y año actual
            today=localtime(now()).date()
            filters &=Q(date__year=today.year,date__month=month)

        return Transaction.objects.filter(filters).order_by('-id')

    @action(detail=False,methods=['get'])
    def export_all(self,request):
        user_id = request.query_params.get('user_id')
        type = request.query_params.get('type')
        date = request.query_params.get('date')
        month = request.query_params.get('month')

        filters = Q()

        if user_id:
            filters &= Q(user_id=user_id)
        if type:
            filters &= Q(type=type)
        if date:
            filters &= Q(date=date)
        if month:
            today = localtime(now()).date()
            filters &= Q(date__year=today.year, date__month=month)
        transactions = Transaction.objects.filter(filters).order_by('-id')
        serializer=self.get_serializer(transactions,many=True)
        return Response(serializer.data)

    @action(detail=False,methods=['get'])
    def total_ingresos(self,request):
        user_id=request.query_params.get('user_id')

        today=localtime(now()).date()
        first_day_of_month=today.replace(day=1)
        
        monthly_ingreso=Transaction.objects.filter(
            user_id=user_id,type='ingreso',date__gte=first_day_of_month
        ).aggregate(total=Sum('amount'))['total'] or 0

        return Response({
            "monthly_ingreso": monthly_ingreso
             
         }, status=status.HTTP_200_OK)




    @action(detail=False,methods=['get'])
    def total_expenses(self,request):
        
         user_id = request.query_params.get('user_id')

         today = localtime(now()).date()
         
         first_day_of_month = today.replace(day=1)  # Primer día del mes actual
         first_day_of_year = today.replace(month=1, day=1)  # Primer día del año actual

         # Gasto diario
         daily_expense = Transaction.objects.filter(
             user_id=user_id, type="gasto", date=today
         ).aggregate(total=Sum('amount'))['total'] or 0

         
         # Gasto mensual
         monthly_expense = Transaction.objects.filter(
             user_id=user_id, type="gasto", date__gte=first_day_of_month
         ).aggregate(total=Sum('amount'))['total'] or 0

         # Gasto anual
         yearly_expense = Transaction.objects.filter(
             user_id=user_id, type="gasto", date__gte=first_day_of_year
         ).aggregate(total=Sum('amount'))['total'] or 0

         return Response({
             "daily_expense": daily_expense,
             "monthly_expense": monthly_expense,
             "yearly_expense": yearly_expense
         }, status=status.HTTP_200_OK)

    def perform_create(self, serializer):
        # Si no se proporciona una fecha, usa la fecha actual
        if 'date' not in serializer.validated_data:
            serializer.validated_data['date'] = timezone.now().date()
        # Asigna el usuario autenticado como el usuario de la transacción
        serializer.save()

    def create(self, request, *args, **kwargs):
        serializer=self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        response_data={
            "message":"Transacción creado con éxito",
            "transaction":serializer.data
        }

        return Response(response_data,status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        partial=kwargs.pop('partial',False)
        instance=self.get_object()
        serializer=self.get_serializer(instance,data=request.data,partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        response_data={
            "message":"Transacción actualizada corerctamente!",
            "transaction":serializer.data
        }

        return Response(response_data,status=status.HTTP_200_OK)
    
    def destroy(self, request, *args, **kwargs):
        instance=self.get_object()
        self.perform_destroy(instance)
        response_data={
            "message":"Transacción eliminada corerctamente!"
            }

        return Response(response_data,status=status.HTTP_200_OK)
    

    
        
