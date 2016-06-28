using System.Web;
using System.Web.Mvc;

namespace Deloitte.TOD.TalentAnalyticsSite
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}