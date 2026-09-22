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

        // Fallback usado solo si AppConfig.ConnectionString no llegó a setearse
        // (p.ej. algo que use DataBase sin pasar por Metropolitan/Startup.cs).
        // El valor real en uso normalmente viene de appsettings.json.
        private const string fallbackConnection = @"Data Source=192.168.0.128;
                                    Initial Catalog=demoTurismoDev;
                                    Persist Security Info=False;
                                    User ID=sa;
                                    pwd=YourPassword123!;";

        private string connection => !string.IsNullOrEmpty(AppConfig.ConnectionString) ? AppConfig.ConnectionString : fallbackConnection;

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
