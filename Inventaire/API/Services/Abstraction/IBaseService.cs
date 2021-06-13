using API.Services.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Services.Abstraction
{
    public interface IBaseService<T, KeyType>
    {
        Task<ServiceResponse<T>> Add(T obj);

        ServiceResponse<IEnumerable<T>> Get();

        Task<ServiceResponse<T>> GetById(KeyType id);

        Task<ServiceResponse<T>> Remove(KeyType id);

        Task<ServiceResponse<T>> Update(T obj);
    }
}