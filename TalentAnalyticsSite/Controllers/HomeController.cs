using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Configuration;

namespace Deloitte.TOD.TalentAnalyticsSite.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/

        public ActionResult Index()
        {

            ViewBag.analyticsAccountKey = ConfigurationManager.AppSettings.Get("AnalyticsAccountKey");
            return View();
        }

    }
}
