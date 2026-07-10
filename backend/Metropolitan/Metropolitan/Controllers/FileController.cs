using Common.model;
using DataBase;
using DataBase.management;
using DataBase.model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Metropolitan.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        counterManagement gestordb = new counterManagement();
        NotaDebitoTravelManagement gestorNotaDebito = new NotaDebitoTravelManagement();
        OperacionPagoTravelManagement gestorOperacionPago = new OperacionPagoTravelManagement();

        // GET api/values
        [HttpPost("uploadFile")]
        public ActionResult<IEnumerable<String>> uploadFileNotaDebitoTravel([FromForm(Name = "file")] IFormFile file,
            [FromForm(Name = "codOperadorNormal")] IFormCollection coperadorNormal,
            [FromForm(Name = "codOperadorLowCost")] IFormCollection coperadorLowCost,
            [FromForm(Name = "codOperadorAMP")] IFormCollection coperadorAMP,
            [FromForm(Name = "codOperadorNacional")] IFormCollection coperadorNacional,
            [FromForm(Name = "codCliente")] IFormCollection codCliente,
            [FromForm(Name = "userId")] IFormCollection userId,
            [FromForm(Name = "codSucursal")] IFormCollection codSucursal)

        {
            try
            {
                int localUserId = Convert.ToInt32(userId["userId"][0]);
                int codigoOperadorNormal = 0;
                int codigoOperadorLowCost = 0;
                int codigoOperadorAMP = 0;
                int codigoOperadorNacional = 0;

                if (coperadorNormal["codOperadorNormal"][0] != "null")
                {
                    codigoOperadorNormal = Convert.ToInt32(coperadorNormal["codOperadorNormal"][0]);
                }
                if (coperadorNacional["codOperadorNacional"][0] != "null")
                {
                    codigoOperadorNacional = Convert.ToInt32(coperadorNacional["codOperadorNacional"][0]);
                }
                if (coperadorLowCost["codOperadorLowCost"][0] != "null")
                {
                    codigoOperadorLowCost = Convert.ToInt32(coperadorLowCost["codOperadorLowCost"][0]);
                }
                if (coperadorAMP["codOperadorAMP"][0] != "null")
                {
                    codigoOperadorAMP = Convert.ToInt32(coperadorAMP["codOperadorAMP"][0]);
                }


                int codigoCliente = Convert.ToInt32(codCliente["codCliente"][0]);
                int idSucursal = Convert.ToInt32(codSucursal["codSucursal"][0]);
                DateTime fechaRegistro = DateTime.ParseExact(codCliente["fechaRegistro"], "MM/dd/yyyy", CultureInfo.InvariantCulture);//Convert.ToDateTime(codCliente["fechaRegistro"][0].ToString());

                excelManagement read = new excelManagement();
                Stream readFi = file.OpenReadStream();

                var memoryStream = new MemoryStream();
                file.CopyTo(memoryStream);
                memoryStream.Seek(0, SeekOrigin.Begin);

                List<notaVenta> ds = new List<notaVenta>();

                IWorkbook hssf = null;

                //if (file.FileName.ToLower().Contains("xlsx"))
                //{
                //    hssf = new XSSFWorkbook(memoryStream);
                //}
                //else
                //{
                hssf = new HSSFWorkbook(memoryStream);
                //}
                int count = 2;
                int codigoUnico = gestorNotaDebito.generateCodigoUnico(idSucursal);
                List<notaDebitoTravelace> notasDebito = new List<notaDebitoTravelace>();
                notaDebitoTravelace notaDebito;
                double totalPagar = 0;
                bool notaCreada = false;
                while ((hssf.GetSheet("Hoja1").GetRow(count) != null) && hssf.GetSheet("Hoja1").GetRow(count).Cells.Count > 0 && hssf.GetSheet("Hoja1").GetRow(count).Cells[0].StringCellValue != "VACACIONAL")
                {
                    if (count > 2)
                    {
                        if (string.IsNullOrEmpty(hssf.GetSheet("Hoja1").GetRow(count).Cells[0].StringCellValue))
                        {
                            break;
                        }
                        try
                        {
                            var celdas = hssf.GetSheet("Hoja1").GetRow(count).Cells;
                            notaDebito = new notaDebitoTravelace();
                            notaDebito.fechaGestion = fechaRegistro;
                            notaDebito.fechaVencimiento = fechaRegistro;
                            notaDebito.codTipoCambio = 1;
                            notaDebito.codCliente = codigoCliente;
                            //notaDebito.codOperador = codigoOperador;
                            notaDebito.voucher = celdas[0].StringCellValue;
                            notaDebito.pasajero = celdas[1].StringCellValue;
                            notaDebito.servicio = celdas[2].StringCellValue;
                            notaDebito.montoNeto = float.Parse(celdas[3].NumericCellValue.ToString());
                            notaDebito.idSucursal = idSucursal;
                            notaDebito.createBy = localUserId;
                            notaDebito.createDate = DateTime.Now;
                            totalPagar += notaDebito.montoNeto;

                            string counterName;
                            try
                            {
                                counterName = celdas[4].StringCellValue.ToUpper();
                            }
                            catch
                            {
                                counterName = "";
                            }
                            int codCounter = getCounter(counterName, codigoOperadorNormal, codigoOperadorLowCost, codigoOperadorAMP, codigoOperadorNacional);
                            notaDebito.codCounter = codCounter;
                            notasDebito.Add(notaDebito);
                            try
                            {
                                notaDebito.isEspecial = 0;
                                notaDebito.codigoUnico = codigoUnico;
                                notaDebito = gestorNotaDebito.calcularNotadebitoTravelace(notaDebito, codigoOperadorNormal, codigoOperadorLowCost, codigoOperadorAMP, codigoOperadorNacional);
                                gestorNotaDebito.createnotadebitoTravelace(notaDebito);
                            }
                            catch (Exception ex)
                            {
                                throw new Exception(ex.Message);
                            }
                        }
                        catch (Exception ex)
                        {
                            throw new Exception(ex.Message);
                        }
                        notaCreada = true;
                    }
                    count++;

                }

                if (notaCreada)
                {
                    double opSum = 0;
                    foreach (var item in notasDebito)
                    {
                        opSum += (item.montoNeto - item.totalAgencia);
                    }

                    operacionPagoTravelace opPago = new operacionPagoTravelace();
                    opPago.anulado = 0;
                    opPago.createBy = localUserId;
                    opPago.createDate = DateTime.Now;
                    opPago.fechaPago = DateTime.Now;
                    opPago.pagado = false;
                    opPago.idSucursal = idSucursal;
                    opPago.saldoDeudor = opSum;
                    opPago.numeroNotaDebito = codigoUnico;
                    gestorOperacionPago.createOrdenPagoTravelace(opPago);
                }
                if (notaCreada)
                {
                    return Ok(notasDebito);
                }
                else
                {
                    throw new Exception("El archivo no es correcto, no cumple el formato");
                }
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        private int getCounter(
            string counterName,
            int idProveedorNormal,
            int proveedorLow,
            int provedeorAMT,
            int proveedorNacional)
        {
            Counter counter = gestordb.getCounterByName(counterName);
            List<Counter> resultCounterByAgencia = gestordb.getCounterByProveedor(idProveedorNormal);
            resultCounterByAgencia.AddRange(gestordb.getCounterByProveedor(proveedorLow));
            resultCounterByAgencia.AddRange(gestordb.getCounterByProveedor(provedeorAMT));
            resultCounterByAgencia.AddRange(gestordb.getCounterByProveedor(proveedorNacional));
            List<Counter> resultFind = resultCounterByAgencia.Where(d => d.id == counter.id).ToList<Counter>();
            if (resultFind.Count > 0)
            {
                if (counter.id == 0)
                {
                    counter = new Counter();
                    counter.name = "";
                    counter.nombreCod = counterName;
                    counter.createBy = 0;
                    counter.createDate = DateTime.Now;
                    gestordb.createCounter(counter);
                    counter = gestordb.getCounterByNombreCod(counterName);
                }
            }
            else
            {
                counter.id = -1;
            }
            return counter.id;
        }

        [HttpPost("uploadFileImageFull")]
        public ActionResult<IEnumerable<String>> uploadFileImageFull([FromForm(Name = "file")] IFormFile file)
        {
            Stream readFi = file.OpenReadStream();

            var memoryStream = new MemoryStream();
            var output = new MemoryStream();
            file.CopyTo(memoryStream);
            memoryStream.Seek(0, SeekOrigin.Begin);

            List<notaVenta> ds = new List<notaVenta>();
            const int size = 1024;
            const int quality = 80;

            using (var image = new Bitmap(memoryStream))
            {
                int width;
                int height;
                if (image.Width > image.Height)
                {
                    width = size;
                    height = Convert.ToInt32(image.Height * size / (double)image.Width);
                }
                else
                {
                    width = Convert.ToInt32(image.Width * size / (double)image.Height);
                    height = size;
                }

                var resized = new Bitmap(width, height);
                using (var graphics = Graphics.FromImage(resized))
                {
                    graphics.CompositingQuality = CompositingQuality.HighSpeed;
                    graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    graphics.CompositingMode = CompositingMode.SourceCopy;
                    graphics.DrawImage(image, 0, 0, width, height);

                    var qualityParamId = Encoder.Quality;
                    var encoderParameters = new EncoderParameters(1);
                    encoderParameters.Param[0] = new EncoderParameter(qualityParamId, quality);
                    var codec = ImageCodecInfo.GetImageDecoders()
                        .FirstOrDefault(codecs => codecs.FormatID == ImageFormat.Jpeg.Guid);

                    resized.Save(output, ImageFormat.Jpeg);

                    Image ee = Image.FromStream(output);
                    ee.Save("test.jpg", ImageFormat.Jpeg);

                }
            }

            return Ok(output.ToArray());
        }
    }
}
