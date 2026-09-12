using Common.model.dashboard;
using DataBase.management.dashboard;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace Metropolitan.Controllers.dashboard
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardCurrencyController : ControllerBase
    {
        DashboardCurrencyManagement gestordb = new DashboardCurrencyManagement();

        [HttpGet("Summary")]
        public ActionResult<CurrencySummaryDto> Summary(int idSucursal, string modulo, DateTime start, DateTime end)
        {
            return gestordb.getCurrencySummary(idSucursal, modulo, start, end);
        }

        [HttpGet("ExchangeRateHistory")]
        public ActionResult<List<ExchangeRateHistoryDto>> ExchangeRateHistory(DateTime start, DateTime end)
        {
            return gestordb.getExchangeRateHistory(start, end);
        }

        [HttpGet("NdByCurrency")]
        public ActionResult<List<NdByCurrencyDto>> NdByCurrency(int idSucursal, string modulo, DateTime start, DateTime end)
        {
            return gestordb.getNdByCurrency(idSucursal, modulo, start, end);
        }

        [HttpGet("NdByCurrencyOverTime")]
        public ActionResult<List<NdByCurrencyPeriodDto>> NdByCurrencyOverTime(int idSucursal, string modulo, DateTime start, DateTime end)
        {
            return gestordb.getNdByCurrencyOverTime(idSucursal, modulo, start, end);
        }

        [HttpGet("NdByCurrencyByModulo")]
        public ActionResult<List<NdByCurrencyModuloDto>> NdByCurrencyByModulo(int idSucursal, string modulo, DateTime start, DateTime end)
        {
            return gestordb.getNdByCurrencyByModulo(idSucursal, modulo, start, end);
        }

        [HttpGet("NdByCurrencyByBranch")]
        public ActionResult<List<NdByCurrencyBranchDto>> NdByCurrencyByBranch(string modulo, DateTime start, DateTime end)
        {
            return gestordb.getNdByCurrencyByBranch(modulo, start, end);
        }

        [HttpGet("PaymentMethodUsage")]
        public ActionResult<List<PaymentMethodUsageDto>> PaymentMethodUsage(int idSucursal, string modulo, DateTime start, DateTime end, int top = 8)
        {
            return gestordb.getPaymentMethodUsage(idSucursal, modulo, start, end, top);
        }
    }
}
