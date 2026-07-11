using Common.model.dashboard;
using DataBase.management.dashboard;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace Metropolitan.Controllers.dashboard
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardFinancialController : ControllerBase
    {
        DashboardFinancialManagement gestordb = new DashboardFinancialManagement();

        [HttpGet("Summary")]
        public ActionResult<FinancialSummaryDto> Summary(int idSucursal, DateTime start, DateTime end)
        {
            return gestordb.getFinancialSummary(idSucursal, start, end);
        }

        [HttpGet("MonthlyRevenue")]
        public ActionResult<List<MonthlyRevenueDto>> MonthlyRevenue(int idSucursal, int meses = 12)
        {
            return gestordb.getMonthlyRevenue(idSucursal, meses);
        }

        [HttpGet("RevenueByBranch")]
        public ActionResult<List<BranchRevenueDto>> RevenueByBranch(int mes, int anio)
        {
            return gestordb.getRevenueByBranch(mes, anio);
        }

        [HttpGet("Receivables")]
        public ActionResult<ReceivablesSummaryDto> Receivables(int idSucursal)
        {
            return gestordb.getReceivablesSummary(idSucursal);
        }

        [HttpGet("TopClients")]
        public ActionResult<List<TopClientDto>> TopClients(int idSucursal, DateTime start, DateTime end, int top = 5)
        {
            return gestordb.getTopClients(idSucursal, start, end, top);
        }

        [HttpGet("ModuleDistribution")]
        public ActionResult<List<ModuleDistributionDto>> ModuleDistribution(int idSucursal, DateTime start, DateTime end)
        {
            return gestordb.getModuleDistribution(idSucursal, start, end);
        }
    }
}
