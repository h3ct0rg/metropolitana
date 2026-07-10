using Common.model;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataBase.management.Logs
{
    public class LogsManagement
    {
        public connectionDB sqlConnection = new connectionDB();

        public void saveLogEvent(LogsModel log)
        {
            string query = string.Format(@"Insert into logsManagement (
                                            eventShoot, fromEvent, userEvent, itemUsed, idSucursal, createDate)
                                            values ('{0}','{1}','{2}','{3}','{4}','{5}')",
                                        log.eventShoot, log.fromEvent, log.userEvent, log.itemUsed, log.idSucursal, DateTime.Now);
            insertUpdateExecute(query);
        }

        public int insertUpdateExecute(string query)
        {            
            sqlConnection.open();

            int result = -1;
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    result = command.ExecuteNonQuery();
                }
            }
            catch (Exception ex)
            {
                sqlConnection.close();
                throw new Exception(ex.Message);
            }
            sqlConnection.close();
            return result;
        }
    }
}
