using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Security;
using System.IdentityModel.Services;
using System.Configuration;

namespace TalentAnalyticsSite.Controllers
{
    public class LogoutController : Controller
    {
        // GET: api/Logout/
        public string Get()
        {
            //Session.Abandon();
            //FormsAuthentication.SignOut();
            
            //string absoluteUrl = HttpContext.Request.Url.AbsoluteUri; 
            //string replyUrl = absoluteUrl.Substring(0, absoluteUrl.LastIndexOf("/") + 1); 
            var issuer = ConfigurationManager.AppSettings["AuthUrl"];
            var replyTo = ConfigurationManager.AppSettings["ActionUrl"];
            //WSFederationAuthenticationModule.FederatedSignOut(new Uri(), new Uri());

            try
            {
                FormsAuthentication.SignOut();
                Session.Abandon();
                WSFederationAuthenticationModule.FederatedSignOut(new Uri(issuer), new Uri(replyTo));
            }

            finally
            {
                FederatedAuthentication.SessionAuthenticationModule.DeleteSessionTokenCookie();
            }
            
            return "success";

        }
    }
}
