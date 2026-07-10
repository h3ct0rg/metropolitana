using DataBase.model;
using NPOI.HSSF.UserModel;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
    public class FileExcelHandler
    {
        public FileExcelHandler()
        {

        }

        public List<notaVenta> readFile(Stream file)
        {
            var memoryStream = new MemoryStream();
            file.CopyTo(memoryStream);
            memoryStream.Seek(0, SeekOrigin.Begin);

            List<notaVenta> ds = new List<notaVenta>();
            HSSFWorkbook hssfwb = new HSSFWorkbook(memoryStream);
            return ds;
        }
    }
}
