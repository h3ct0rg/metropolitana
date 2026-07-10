using Common;
using DataBase.model;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataBase.management
{
    public class excelManagement
    {
        FileExcelHandler excelFile = new FileExcelHandler();
        public excelManagement()
        {

        }

        public void saveRows(Stream file)
        {
            List<notaVenta> d = excelFile.readFile(file);
        }
    }
}
