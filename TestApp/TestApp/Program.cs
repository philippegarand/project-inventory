using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using TestApp;
using TestApp.Models;

public class Program
{
    private static StreamWriter logger;

    private const int batchBaseNb = 25;

    private static readonly Random rnd = new(Guid.NewGuid().GetHashCode());

    public static async Task Main(string[] args)
    {
        ServicePointManager.ServerCertificateValidationCallback =
                delegate (object sender, X509Certificate certificate, X509Chain chain, SslPolicyErrors sslPolicyErrors)
                {
                    return true;
                };

        var dirPath = Directory.GetParent(Environment.CurrentDirectory).Parent.Parent.FullName + @"\performanceLog";
        Directory.CreateDirectory(dirPath);
        logger = File.AppendText(@$"{dirPath}\log.csv");

        if (new FileInfo(@$"{dirPath}\log.csv").Length == 0)
            logger.WriteLine("Date;test #;Nb of Calls;Time Taken; AveragePerCall; Overall Average; Min; Max; Standard Deviation");

        bool showMenu = true;
        while (showMenu)
            showMenu = await MainMenu();

        logger.Close();

        Console.WriteLine("");
        Console.WriteLine(@"Tests successfully ran, see the result here: \TestApp\TestApp\performanceLog\log.csv");
        Console.WriteLine("\nType anything to close...");
        Console.ReadKey();
    }

    private static int SubMenu()
    {
        Console.WriteLine("");

        int number = -1;
        while (number <= 0)
        {
            Console.Write($"Select how many iterations (calls batched by {batchBaseNb} * iteration index number): ");
            bool success = int.TryParse(Console.ReadLine(), out number);
            if (success && number > 0) break;
        }
        Console.WriteLine("");
        return number;
    }

    private static async Task<bool> MainMenu()
    {
        Console.Clear();
        Console.WriteLine("Choose an option:");
        Console.WriteLine("1) ProductAvailability (scan) test");
        Console.WriteLine("2) Get Products test");
        Console.WriteLine("3) Exit");
        Console.Write("\r\nSelect an option: ");

        int nbIter = 0;
        switch (Console.ReadLine())
        {
            case "1":
                while (nbIter <= 0)
                    nbIter = SubMenu();
                await ProductAvailabilityTest(nbIter);
                return false;

            case "2":
                while (nbIter <= 0)
                    nbIter = SubMenu();
                await ProductTest(nbIter);
                return false;

            case "3":
                return false;

            default:
                return true;
        }
    }

    private static async Task ProductAvailabilityTest(int nbIter)
    {
        logger.WriteLine($"{DateTime.Now};PA Put Test");

        string route = "ProductAvailability";

        var productAvailabilities = JsonConvert.DeserializeObject<ServiceResponse<IEnumerable<ProductAvailability>>>(await new RequestToApi
            (new HttpClient(), route).GetAsync().Result.Content.ReadAsStringAsync()).Data.ToList();

        var productLength = productAvailabilities.Count;

        if (productLength == 0)
        {
            Console.WriteLine("There is no products in the DB. Tests require some data. \n Exiting program ...");
            return;
        }

        var resList = new List<double>(new double[nbIter]);
        for (int i = 1; i < nbIter + 1; i++)
        {
            // To use different productAvailability for each call
            var temp = new List<ProductAvailability>(new ProductAvailability[batchBaseNb * i]);
            var toUse = new List<StringContent>(new StringContent[batchBaseNb * i]);
            for (int j = 0; j < batchBaseNb * i; j++)
            {
                temp[j] = productAvailabilities[rnd.Next((batchBaseNb * i) - 1) % productLength];
                temp[j].quantity = rnd.Next(1, 100);
                toUse[j] = new StringContent(JsonConvert.SerializeObject(temp[j]), Encoding.UTF8, "application/json");
            }

            resList[i - 1] = await AddOrUpdateProductAvailability(i, batchBaseNb * i, route, toUse);
            Console.WriteLine($"Batch of {batchBaseNb * i} calls done!");
        }

        var avAverage = resList.Average();

        logger.WriteLine($";;;;;{avAverage};{resList.Min()};{resList.Max()};" +
            Math.Sqrt(resList.Sum(d => Math.Pow(d - avAverage, 2)) / resList.Count));
    }

    private static async Task ProductTest(int nbIter)
    {
        logger.WriteLine($"{DateTime.Now};Product Get Test");

        string route = "Product";

        var productIds = JsonConvert.DeserializeObject<ServiceResponse<IEnumerable<Product>>>(await new RequestToApi
            (new HttpClient(), route).GetAsync().Result.Content.ReadAsStringAsync()).Data.Select(p => p.ProductID).ToList();

        var productLength = productIds.Count;
        if (productLength == 0)
        {
            Console.WriteLine("There are no products in the DB. Tests require some data. \n Exiting program ...");
            return;
        }

        var resList = new List<double>(new double[nbIter]);

        for (int i = 1; i < nbIter + 1; i++)
        {
            // To use different product id for each call
            var toUse = new List<Guid>(new Guid[batchBaseNb * i]);
            toUse = toUse.Select(p => productIds[rnd.Next((batchBaseNb * i) - 1) % productLength]).ToList();

            resList[i - 1] = await GetProduct(i, batchBaseNb * i, route, toUse);
            Console.WriteLine($"Batch of {batchBaseNb * i} calls done!");
        }

        var avAverage = resList.Average();

        logger.WriteLine($";;;;;{avAverage};{resList.Min()};{resList.Max()};" +
            Math.Sqrt(resList.Sum(d => Math.Pow(d - avAverage, 2)) / resList.Count));
    }

    public static async Task<double> GetProduct(int testNumber, int numberOfCall, string route, List<Guid> productIds)
    {
        var totalTime = new Stopwatch();
        var request = new RequestToApi(new HttpClient(), route);
        var resList = new List<Task<HttpResponseMessage>>(new Task<HttpResponseMessage>[numberOfCall]);

        totalTime.Start(); // Start timer and batched calls
        for (int i = 0; i < numberOfCall; i++)
            resList[i] = request.GetAsync(productIds[i]);

        await Task.WhenAll(resList);
        totalTime.Stop(); // When batch is done

        var average = totalTime.ElapsedMilliseconds / (double)numberOfCall;

        logger.WriteLine($";{testNumber}; {numberOfCall};{totalTime.ElapsedMilliseconds}; {average}");
        return average;
    }

    public static async Task<double> AddOrUpdateProductAvailability(int testNumber, int numberOfCall, string route, List<StringContent> pasJson)
    {
        var totalTime = new Stopwatch();
        var request = new RequestToApi(new HttpClient(), route);
        var resList = new List<Task>(new Task<HttpResponseMessage>[numberOfCall]);

        totalTime.Start(); // Start timer and batched calls
        for (int i = 0; i < numberOfCall; i++)
            resList[i] = request.PutAsync(pasJson[i]);

        await Task.WhenAll(resList);
        totalTime.Stop(); // When batch is done

        var average = totalTime.ElapsedMilliseconds / (double)numberOfCall;

        logger.WriteLine($";{testNumber}; {numberOfCall};{totalTime.ElapsedMilliseconds}; {average}");
        return average;
    }
}