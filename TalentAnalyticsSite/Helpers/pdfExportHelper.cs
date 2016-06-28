using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using WebSupergoo.ABCpdf9;

namespace TalentAnalyticsSite.Helpers
{
    public class pdfExportHelper
    {
        public string GetHTML(string exportUrl)
        {          

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(exportUrl);
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            string data = string.Empty;
            if (response.StatusCode == HttpStatusCode.OK)
            {
                Stream receiveStream = response.GetResponseStream();
                StreamReader readStream = null;

                if (response.CharacterSet == null)
                {
                    readStream = new StreamReader(receiveStream);
                }
                else
                {
                    readStream = new StreamReader(receiveStream, Encoding.GetEncoding(response.CharacterSet));
                }

                data = readStream.ReadToEnd();

                response.Close();
                readStream.Close();
            }
            return data;
        }
        public byte[] GeneratePDFFromView(string htmlContent,string url)
        {
            string html;
            using (var writer = new StringWriter())
            {

                html = htmlContent;

                //System.IO.File.WriteAllText(@"c:\demo\final.html", html);
            }

            return GeneratePDF(html,url);

        }
        public byte[] GeneratePDF(string html,string url)
        {
            var theDoc = new Doc();
            theDoc.AddImageUrl(url);
            var pageId = theDoc.AddImageHtml(html, true, 1170, false);
            pageId = theDoc.AddImageToChain(pageId);
            theDoc.SetInfo(theDoc.Root, "/PageMode:Name", "UseNone");

          

            byte[] result;
            using (var memoryStream = new MemoryStream())
            {
                theDoc.Save(memoryStream);
                result = memoryStream.ToArray();
            }

            theDoc.Clear();

            return result;
        }
    }
}