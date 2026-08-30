using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataBase
{
    public class connectionDB
    {
        public SqlConnection _sqlConnect;
        //Data Source = DESKTOP - 8SPN3J2\SQLEXPRESS;Integrated Security = True

        //private string connection = @"Data Source=metropolitan.mssql.somee.com;
        //                            Initial Catalog=metropolitan;
        //                            Persist Security Info=False;
        //                            User ID=metropolitan_SQLLogin_1;
        //                            pwd=nt8bwsrrxl;";

        //private string connection = @"Data Source=metropolitanaDB.mssql.somee.com;
        //                            Initial Catalog=metropolitanaDB;
        //                            Persist Security Info=False;
        //                            User ID=metropolitanam_SQLLogin_1;
        //                            pwd=m3tafxnioq;";

        private string connection = @"Data Source=192.168.0.128;
                                    Initial Catalog=demoTurismoDev;
                                    Persist Security Info=False;
                                    User ID=sa;
                                    pwd=YourPassword123!;";


        public connectionDB()
        {
            _sqlConnect = new SqlConnection(connection);
        }

        public void open()
        {
            _sqlConnect.Open();
        }

        public void close()
        {
            _sqlConnect.Close();
        }
    }
}
