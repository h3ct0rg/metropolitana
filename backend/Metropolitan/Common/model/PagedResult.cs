using System.Collections.Generic;

namespace Common.model
{
    public class PagedResult<T>
    {
        public List<T> data { get; set; }
        public int total { get; set; }
    }
}
