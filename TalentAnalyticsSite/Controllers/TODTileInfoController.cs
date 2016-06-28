using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
//using Sap.Data.Hana;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace TalentAnalyticsSite.Controllers
{
    public class TODTileInfoController : ApiController
    {
        public IHttpActionResult Get(string id)
        {

            string sContent = "<div>" +
                                    "<ul> "+
                                        "<li>Employee Quickview<strong>58%</strong></li>"+                                      
                                    "</ul> </div>";


            TODTileResponse response = new TODTileResponse();
            response.ActionUrl = System.Configuration.ConfigurationManager.AppSettings["ActionUrl"];
            response.Title = "Talent Analytics";
            response.Content = sContent;

            if (HasAccess(id))
            {
                return Ok(response);
            }
            else
            {
                return new System.Web.Http.Results.StatusCodeResult(HttpStatusCode.Unauthorized, Request);
            }            
        }

        public bool HasAccess(string userid)
        {

            //HanaConnection con = new HanaConnection("Server=ushdc8514.us.deloitte.com(00);UserID=jomichael;Password=deloitte.1");

            //Open the database connection
            //con.Open();

            /*
            String strSQL = "select * from customers order by ID desc";
            //Execute the SQL statement
            HanaCommand cmd = new HanaCommand(strSQL, con);

            //Read and store the result set
            HanaDataReader reader = cmd.ExecuteReader();


            //Close the reader connection
            reader.Close();

            //Close the database connection
            conn.Close();
             * 
             * */
            return true;
        }

    }

    public class TODTileResponse
    {
        public string Content { get; set; }
        public string ActionUrl { get; set; }
        public string Title { get; set; }
    }
}
