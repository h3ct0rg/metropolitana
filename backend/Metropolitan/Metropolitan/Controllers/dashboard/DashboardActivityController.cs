using Common.model.dashboard;
using DataBase.management.dashboard;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace Metropolitan.Controllers.dashboard
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardActivityController : ControllerBase
    {
        DashboardActivityManagement gestordb = new DashboardActivityManagement();

        [HttpGet("Summary")]
        public ActionResult<ActivitySummaryDto> Summary()
        {
            return gestordb.getActivitySummary();
        }

        [HttpGet("NotesByUser")]
        public ActionResult<List<UserActivityDto>> NotesByUser(int idSucursal, DateTime start, DateTime end, int top = 10)
        {
            return gestordb.getNotesByUser(idSucursal, start, end, top);
        }

        [HttpGet("DailyActivity")]
        public ActionResult<List<DailyActivityDto>> DailyActivity(int dias = 30)
        {
            return gestordb.getDailyActivity(dias);
        }

        [HttpGet("ActivityByBranch")]
        public ActionResult<List<BranchActivityDto>> ActivityByBranch(DateTime start, DateTime end)
        {
            return gestordb.getActivityByBranch(start, end);
        }

        [HttpGet("RecentEvents")]
        public ActionResult<List<RecentEventDto>> RecentEvents(int top = 50)
        {
            return gestordb.getRecentEvents(top);
        }

        [HttpGet("EventTypeDistribution")]
        public ActionResult<List<EventTypeDistributionDto>> EventTypeDistribution(DateTime start, DateTime end)
        {
            return gestordb.getEventTypeDistribution(start, end);
        }
    }
}
