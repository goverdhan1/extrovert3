using Newtonsoft.Json.Linq;
using NPOI.SS.UserModel;
using NPOI.SS.Util;
using NPOI.XSSF.UserModel;
using System;
using System.Configuration;
using System.Drawing;
using System.IO;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using TalentAnalyticsSite.Helpers;
using WebSupergoo.ABCpdf10;


namespace Deloitte.TOD.TalentAnalyticsSite.Controllers
{
    public class ExportController : Controller
    {
        //
        // GET: /Export/
        [ValidateInput(false)]
        [System.Web.Mvc.HttpPost]
        public string Excel(string excelData, string filename, string fileExtension, string chartImageData)
        {
            string fileNameWithExtn = string.Format("{0}.{1}", filename.Replace(' ', '_'), fileExtension);

            if (fileExtension.ToLower() == "csv")
            {
                Response.Clear();
                Response.ContentType = "text/csv";
                Response.AddHeader("Content-Disposition", "attachment;filename=" + fileNameWithExtn);
                Response.Write(excelData);
                Response.Flush();
                Response.End();

            }
            else if (fileExtension.ToLower() == "xlsx")
            {
                Response.Clear();
                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                Response.AddHeader("Content-Disposition", string.Format("attachment;filename={0}", fileNameWithExtn));
                InitializeWorkbook();
                GenerateData(excelData, chartImageData);
                xssfworkbook.Write(Response.OutputStream);
                Response.Flush();
                Response.End();
            }
            return string.Empty;
        }       

        private XSSFWorkbook xssfworkbook;

        private MemoryStream WriteToStream()
        {
            //Write the stream data of workbook to the root directory
            MemoryStream file = new MemoryStream();
            xssfworkbook.Write(file);
            return file;
        }

        private void GenerateData(string html, string chartImageData)
        {
            #region Excel Style sheet

            IFont font1 = xssfworkbook.CreateFont();
            font1.FontHeightInPoints = 20;
            ICellStyle style1 = xssfworkbook.CreateCellStyle();
            style1.SetFont(font1);

            IFont font2 = xssfworkbook.CreateFont();
            font2.IsBold = true;

            ICellStyle style2 = xssfworkbook.CreateCellStyle();
            style2.SetFont(font2);

            #endregion

            int newRow = 0;

            // Creating new Sheet
            ISheet sheet1 = xssfworkbook.CreateSheet("Employee Quickview");

            try
            {
                AddImage(sheet1, chartImageData);

                // Parsing request object
                JObject obj = JObject.Parse(html);

                // Merge columns for Employee name
                sheet1.AddMergedRegion(new CellRangeAddress(newRow, 0, 0, 3));

                IRow row = sheet1.CreateRow(newRow);
                ICell cell = row.CreateCell(0);

                if (obj["employeeName"] != null)
                {
                    cell.SetCellValue(obj["employeeName"].ToString());
                    cell.CellStyle = style1;
                }

                newRow = newRow + 2;

                row = sheet1.CreateRow(newRow);


                #region Bind header information

                if (obj["showHeaderInfo"] != null && (Boolean)obj["showHeaderInfo"] == true)
                {

                    cell = row.CreateCell(0);
                    cell.SetCellValue("Personnel Sub Area Desc");
                    cell.CellStyle = style2;

                    cell = row.CreateCell(1);
                    cell.SetCellValue("Employee Job Level");
                    cell.CellStyle = style2;

                    cell = row.CreateCell(2);
                    cell.SetCellValue("Desk Phone");
                    cell.CellStyle = style2;

                    newRow++;
                    row = sheet1.CreateRow(newRow);

                    cell = row.CreateCell(0);
                    if (obj["location"] != null)
                        cell.SetCellValue(obj["location"].ToString());

                    cell = row.CreateCell(1);
                    if (obj["jobLevel"] != null)
                        cell.SetCellValue(obj["jobLevel"].ToString());

                    cell = row.CreateCell(2);
                    if (obj["desphone"] != null)
                        cell.SetCellValue(obj["desphone"].ToString());
                }

                #endregion

                newRow = newRow + 2;

                foreach (JObject section in obj["sections"])
                {
                    int newHdCol = 0;

                    row = sheet1.CreateRow(newRow);

                    cell = row.CreateCell(0);

                    if (section["title"] != null)
                    {
                        cell.SetCellValue(section["title"].ToString());
                        cell.CellStyle = style1;
                    }

                    newRow++; newRow++;

                    newRow += 10; // Bottom margin for the chart image.

                    row = sheet1.CreateRow(newRow);

                    #region Bind table header

                    foreach (JObject header in section["header"])
                    {
                        if (section["title"] != null)
                        {
                            if (section["title"].ToString() != "BASIC INFO DETAIL")
                            {
                                cell = row.CreateCell(newHdCol);

                                if (header["FIELD_LABEL"] != null)
                                {
                                    cell.SetCellValue(header["FIELD_LABEL"].ToString());
                                    cell.CellStyle = style2;
                                }
                                newHdCol++;
                            }
                        }
                    }

                    #endregion

                    newRow++;

                    #region Bind data

                    foreach (JObject data in section["data"])
                    {
                        row = sheet1.CreateRow(newRow);

                        int newColData = 0;
                        int dataIndex = 0;

                        foreach (JObject header in section["header"])
                        {
                            if (section["title"].ToString() != "BASIC INFO DETAIL")
                            {
                                if (header["FIELD_NAME"] != null && data[header["FIELD_NAME"].ToString()] != null)
                                    row.CreateCell(newColData).SetCellValue(data[header["FIELD_NAME"].ToString()].ToString());

                                newColData++;
                            }
                            else
                            {
                                // Condition is used to display Basic info detail in two columns
                                if (dataIndex == 0 || dataIndex % 2 == 0)
                                {
                                    newColData = 0;

                                    if (dataIndex != 0)
                                        row = sheet1.CreateRow(newRow);

                                    newRow++;
                                } dataIndex++;

                                cell = row.CreateCell(newColData);

                                if (header["FIELD_LABEL"] != null)
                                    cell.SetCellValue(header["FIELD_LABEL"].ToString());

                                cell.CellStyle = style2;
                                newColData++;

                                if (header["FIELD_NAME"] != null && data[header["FIELD_NAME"].ToString()] != null)
                                    row.CreateCell(newColData).SetCellValue(data[header["FIELD_NAME"].ToString()].ToString());

                                newColData++;
                            }
                        }
                        newRow++;
                    }

                    #endregion

                    newRow++; newRow++;
                }

                // Set auto width for excel column
                for (int i = 0; i <= 20; i++)
                {
                    sheet1.AutoSizeColumn(i);
                    GC.Collect();
                }
            }
            catch
            { }
        }

        private void InitializeWorkbook()
        {
            xssfworkbook = new XSSFWorkbook();
        }

        private void AddImage(ISheet sheet, string chartImageData)
        {
            if (!String.IsNullOrEmpty(chartImageData))
            {
                try
                {
                    chartImageData = chartImageData.Replace("data:image/png;base64,", string.Empty);
                                
                    byte[] bytes = Convert.FromBase64String(chartImageData);

                    int pictureIdx = xssfworkbook.AddPicture(bytes, PictureType.PNG);

                    ICreationHelper helper = xssfworkbook.GetCreationHelper();

                    // Create the drawing patriarch. 
                    // This is the top level container for all shapes.
                    IDrawing drawing = sheet.CreateDrawingPatriarch();

                    // Add a picture shape
                    IClientAnchor anchor = helper.CreateClientAnchor();

                    //Set top-left corner of the picture.
                    anchor.Col1 = 2;
                    anchor.Row1 = 2;
                    IPicture pict = drawing.CreatePicture(anchor, pictureIdx);

                    //Auto-size picture relative to its top-left corner.
                    pict.Resize();
                }
                catch (FormatException)
                {
                    // TODO: Logging exception.
                }
            }
        }

        [ValidateInput(false)]
        [System.Web.Mvc.HttpPost]
        public FileStreamResult PDF(string exportUrl, string exportPDFFilename, string docHTML, string clientHeight)
        {
            XSettings.InstallLicense("X/VKS0cNn5FhpydaGfTQKt+0efQWCtVwkfTQwuG8WBxlkQ7GfiWiNq1RDWxxjAcIC9Es/zpbpChwyqooSbJ1y1Q6Z2OeAHI9tGZLYdf9U03h1h3G5o9adrPFLGKub2slRr1yVsBU/kd9BSd6rC+GOFZYcDuMT2Sk6utSxlw+S/nX2rs+t3TY9HHWordA5Fx0aBVA2GxRzniOBxJiOrRZtWJjqlWFHMw+Rd3DGx/lcPvMJ0ExksGLRUdVmBKcFbyKoOlU50Q=");

            var htmlPath = Server.MapPath(string.Format("~/ExportPdf/{0}.html", Guid.NewGuid()));

            System.IO.File.WriteAllText(AppDomain.CurrentDomain.BaseDirectory + "test.txt", docHTML);
            //docHTML = docHTML.Replace("<base href=\"/\">", "<base href=\"" + ConfigurationManager.AppSettings["BaseUrl"] + "\">");
            docHTML = docHTML.Replace("media=\"print\"", "");

            docHTML = docHTML.Substring(0, docHTML.IndexOf("<body")) +
            Regex.Replace(docHTML.Substring(docHTML.IndexOf("<body")), "href = \"#!(.*?)\"", string.Empty, RegexOptions.IgnorePatternWhitespace);
            docHTML = docHTML.Replace("<header", "<header  ");
            docHTML = ReplaceCaseInsensitive(docHTML, " href=\"/headcount/", " href=\"" + ConfigurationManager.AppSettings["BaseUrl"]);
            docHTML = Regex.Replace(docHTML, "<script src=\"\\/App\\/header(.*?)<\\/script>", "");

            // Remove header element data in order to scale html properly on the landscape orientation.
            int headerStartPos = docHTML.IndexOf("<header");
            int headerLastPos = docHTML.LastIndexOf("</header");
            docHTML = docHTML.Remove(headerStartPos, headerLastPos - headerStartPos);

            docHTML = "<html>" + docHTML + "</html>";

            //we only want the static content. take out all script tags to avoid any script executions
            var scriptRegex = new Regex(@"<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>");
            docHTML = scriptRegex.Replace(docHTML, "");

            if (!Directory.Exists(System.IO.Path.GetDirectoryName(htmlPath).ToString()))
                Directory.CreateDirectory(System.IO.Path.GetDirectoryName(htmlPath).ToString());

            System.IO.File.WriteAllText(htmlPath, docHTML, Encoding.UTF8);

            Response.AppendHeader("Content-Disposition", "attachment;filename=" + exportPDFFilename);
            var fsr = new FileStreamResult(ConvertHtmlToPdf(htmlPath, clientHeight), "application/pdf");

            //delete the html file from the folder path
            System.IO.File.Delete(htmlPath);

            return fsr;
        }

        private static string ReplaceCaseInsensitive(string input, string search, string replacement)
        {
            string result = Regex.Replace(
                input,
                Regex.Escape(search),
                replacement.Replace("$", "$$"),
                RegexOptions.IgnoreCase
            );
            return result;
        }

        public Stream ConvertHtmlToPdf(string exportUrl, string clientHeight)
        {
            using (Doc document = new Doc())
            {
                SetHtmlOptions(document);                

                document.Page = document.AddPage();

                SetLandscapeOrientation(document, clientHeight);

                AddImageToPDF(document, exportUrl);               
                return document.GetStream();
            }
        }

        /// <summary>
        /// Sets the HTML options.
        /// </summary>
        /// <param name="document">The document.</param>
        private static void SetHtmlOptions(Doc document)
        {
            document.HtmlOptions.Engine = EngineType.Gecko;
            document.HtmlOptions.ForGecko.AddTags = true;
            document.HtmlOptions.PageCacheEnabled = false;
            document.HtmlOptions.AdjustLayout = true;
            document.HtmlOptions.PageLoadMethod = PageLoadMethodType.WebBrowserNavigate;
            document.HtmlOptions.DoMarkup = true;
            document.HtmlOptions.Media = MediaType.Screen;
            document.HtmlOptions.UseScript = true;
            document.HtmlOptions.AddLinks = false;
            document.HtmlOptions.FontEmbed = false;
            document.HtmlOptions.UseResync = false;
            document.HtmlOptions.UseVideo = false;
            document.HtmlOptions.HideBackground = false;
            document.HtmlOptions.Timeout = 100000;            
        }

        /// <summary>
        /// Set landscape orientation.
        /// </summary>
        /// <param name="document">The document.</param>
        private static void SetLandscapeOrientation(Doc document, string clientHeight)
        {
            // apply a rotation transform
            double w = document.MediaBox.Width;
            double h = 2100;
            double l = 0;
            double b = 0;
            document.Transform.Rotate(90, l, b);
            document.Transform.Translate(w, 0);

            // rotate our rectangle
            document.Rect.Width = h;
            document.Rect.Height = w;

            // Margins
            document.Rect.Move(25, -30);

            // Set white color to the borders
            document.Color.String = "255 255 255";

            // Scaling of html.
            int height;
            if (!string.IsNullOrEmpty(clientHeight) && int.TryParse(clientHeight, out height))
                document.HtmlOptions.BrowserWidth = height * Convert.ToInt32(document.Rect.Width / document.Rect.Height);

            // To change the default orientation of the document we need to apply a rotation to the root page object.
            // By doing this we ensure that every page in the document is viewed rotated.
            int theDocID = Convert.ToInt32(document.GetInfo(document.Root, "Pages"));
            document.SetInfo(theDocID, "/Rotate", "90");
        }        

        /// <summary>
        /// Adds the image to PDF.
        /// </summary>
        /// <param name="document">The document.</param>
        /// <param name="url">The URL.</param>
        private static void AddImageToPDF(Doc document, string url)
        {
            int theID = document.AddImageUrl(url);
            document.FrameRect();
            while (document.Chainable(theID))
            {
                if (!document.Chainable(theID)) break;
                document.Page = document.AddPage();
                
                theID = document.AddImageToChain(theID);
            }
        }

        /// <summary>
        /// Adds the page number.
        /// </summary>
        /// <param name="document">The document.</param>
        private static void AddPageNumber(Doc document)
        {
            document.Rect.String = "20 10 600 40";
            document.TextStyle.HPos = 1.0;
            document.TextStyle.VPos = 0.5;
            for (int i = 1; i <= document.PageCount; i++)
            {
                document.PageNumber = i;
                document.AddText("Page " + i.ToString() + " of " + document.PageCount.ToString());
            }
        }
    }
}