using API.Services.Abstraction;
using API.Services.Entities;
using Repository.DataAccess;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;

namespace API.Services
{
    public class BaseService<T, KeyType> : IBaseService<T, KeyType>
    {
        protected readonly IRepository<T, KeyType> _repo;

        public BaseService(IRepository<T, KeyType> repository)
        {
            _repo = repository;
        }

        public async Task<ServiceResponse<T>> Add(T obj)
        {
            if (!_repo.Any(obj))
            {
                await _repo.Add(obj);
                return new ServiceResponse<T>(HttpStatusCode.Created, obj, "Added");
            }
            else
            {
                await _repo.Update(obj);
                return new ServiceResponse<T>(HttpStatusCode.OK, "Updated");
            }
        }

        public ServiceResponse<IEnumerable<T>> Get()
        {
            var res = _repo.Get();
            return new ServiceResponse<IEnumerable<T>>(HttpStatusCode.OK, res);
        }

        public async Task<ServiceResponse<T>> GetById(KeyType id)
        {
            var res = await _repo.GetById(id);
            if (res == null)
            {
                return new ServiceResponse<T>(HttpStatusCode.NotFound, "Object not found!");
            }
            return new ServiceResponse<T>(HttpStatusCode.OK, res);
        }

        public async Task<ServiceResponse<T>> Remove(KeyType id)
        {
            var obj = await _repo.GetById(id);

            if (obj != null)
            {
                await _repo.Remove(obj);
                return new ServiceResponse<T>(HttpStatusCode.Accepted);
            }

            return new ServiceResponse<T>(HttpStatusCode.NotFound, "Object doesn't exist");
        }

        public async Task<ServiceResponse<T>> Update(T obj)
        {
            if (obj != null)
            {
                await _repo.Update(obj);
                return new ServiceResponse<T>(HttpStatusCode.Accepted, "Updated");
            }

            return new ServiceResponse<T>(HttpStatusCode.NotFound, "Object doesn't exist");
        }
    }
}