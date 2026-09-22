namespace DataBase
{
    // Seteado una sola vez al arrancar la app (ver Metropolitan/Startup.cs) a partir de
    // appsettings.json. DataBase es un proyecto de .NET Framework clásico sin acceso a
    // Microsoft.Extensions.Configuration, por eso el valor se recibe así en vez de leerse
    // directamente del JSON acá.
    public static class AppConfig
    {
        public static string ConnectionString { get; set; }
    }
}
