using System.Web;
using System.Web.Optimization;

namespace Deloitte.TOD.TalentAnalyticsSite
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.IgnoreList.Ignore("*.tests.js");

            bundles.Add(new ScriptBundle("~/bundles/vendors").Include(
                "~/Scripts/angular.js",
                "~/Scripts/jquery.ui.touch-punch.min.js",
                "~/Scripts/angular-ui-router.js",
                "~/Scripts/angular-resource.js",
                "~/Scripts/angular-cookies.js",
                "~/Scripts/angular-animate.min.js",
                 "~/Scripts/jquery-ui-1.10.3.js",
                 "~/Scripts/jquery.dataTables.min.js",
                 "~/Scripts/ui-bootstrap-tpls-0.6.0.js",
                 "~/Scripts/toaster.min.js",
                 "~/App/rateThisApp/jquery.ratethisapp.js",
                 "~/Scripts/FileSaver.js"


            ));

            var applicationJSCodeBundle = new ScriptBundle("~/bundles/app").IncludeDirectory("~/App/", "*.js", true);
            applicationJSCodeBundle.Transforms.Clear();
            bundles.Add(applicationJSCodeBundle);

            bundles.Add(new ScriptBundle("~/bundles/analytics").Include(
                "~/Scripts/s_code.js"
            ));
            bundles.Add(new ScriptBundle("~/bundles/vendorGraphs").Include(
              "~/Scripts/raphael-min.js",
                "~/Scripts/d3.min.js",
                "~/Scripts/nv.d3.js"
           ));

            bundles.Add(new StyleBundle("~/bundles/vendorstyles").Include(
                "~/App/core/styles/bootstrap.min.css",
                "~/App/core/styles/font-awesome.min.css",
                "~/App/core/styles/jquery-ui.min.css",
                "~/App/core/styles/jquery.dataTables.css",
                "~/App/core/styles/nv.d3.css",
                "~/Content/toaster.min.css"
            ));

            bundles.Add(new StyleBundle("~/bundles/allpageStyles").Include(
             "~/App/header/styles/header.min.css",
             "~/App/header/styles/top.header.min.css",
                "~/App/dashboard/styles/dashboard.min.css",
               "~/App/exports/styles/taexport.button.min.css",
               "~/App/hcm-filter/styles/hcm-filter.min.css",
               "~/App/hcm-fullview/styles/hcm-fullview.min.css",
               "~/App/hcm-metrics-chat/styles/hcm-metrics.min.css",
                "~/App/hcm-landingpage/styles/hcm-linechart.min.css",
               "~/App/hcm-landingpage/styles/hcm-landing.min.css",
               "~/App/hcm-detailview/styles/hcm-detailview.min.css",
               "~/App/hcm-detailview/styles/hcm-detailed-view-metrics-tree-view.min.css"

           ));
            bundles.Add(new StyleBundle("~/bundles/commonStyles").Include(
               "~/App/core/styles/empqvcommon.min.css",
               "~/App/core/directives/preloader/preloader.min.css"
           ));
            bundles.Add(new StyleBundle("~/bundles/rateAppStyles").Include(
               "~/App/rateThisApp/styles/rate-this-app.min.css"
           ));

        }
    }
}