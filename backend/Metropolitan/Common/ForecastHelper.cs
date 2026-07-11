using System;
using System.Collections.Generic;
using System.Linq;

namespace Common
{
    public static class ForecastHelper
    {
        public static List<(DateTime mes, double valor)> LinearForecast(List<(DateTime mes, double valor)> historico, int mesesAdelante)
        {
            List<(DateTime mes, double valor)> resultado = new List<(DateTime mes, double valor)>();
            if (historico == null || historico.Count < 2 || mesesAdelante <= 0)
            {
                return resultado;
            }

            int n = historico.Count;
            double sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
            for (int i = 0; i < n; i++)
            {
                double x = i;
                double y = historico[i].valor;
                sumX += x;
                sumY += y;
                sumXY += x * y;
                sumXX += x * x;
            }

            double denominador = (n * sumXX) - (sumX * sumX);
            double pendiente = denominador == 0 ? 0 : ((n * sumXY) - (sumX * sumY)) / denominador;
            double intercepto = (sumY - (pendiente * sumX)) / n;

            DateTime ultimoMes = historico[n - 1].mes;
            for (int i = 1; i <= mesesAdelante; i++)
            {
                double x = n - 1 + i;
                double valorProyectado = (pendiente * x) + intercepto;
                DateTime mesProyectado = ultimoMes.AddMonths(i);
                resultado.Add((mesProyectado, Math.Max(0, valorProyectado)));
            }

            return resultado;
        }
    }
}
