using System;
using System.Diagnostics;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace TestApp
{
    internal class RequestToApi
    {
        private readonly HttpClient _httpClient;

        private readonly string _baseUrl;

        public RequestToApi(HttpClient httpClient, string route)
        {
            _httpClient = httpClient;
            var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImJhZDczMGQ1LWY1NDAtNDExOC1hYzE3LTZiYTMxOWRkZmNkYSIsInJvbGUiOiIxIiwibmJmIjoxNjE0MTI5NDQ0LCJleHAiOjE2NDU2NjU0NDIsImlhdCI6MTYxNDEyOTQ0NH0.IXKS90ne338tG26Ji-at_oYwd3IRRkoSx6ZmQoRWIWQ";
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            _baseUrl = "https://localhost:1337/api/";
            _httpClient.BaseAddress = new Uri(string.Concat(_baseUrl, route));
        }

        public async Task<HttpResponseMessage> PutAsync(StringContent data)
        {
            return await _httpClient.PutAsync("", data);
        }

        public async Task<HttpResponseMessage> GetAsync()
        {
            return await _httpClient.GetAsync("");
        }

        public async Task<HttpResponseMessage> GetAsync(Guid id)
        {
            return await _httpClient.GetAsync($"{_httpClient.BaseAddress}/{id}");
        }
    }
}