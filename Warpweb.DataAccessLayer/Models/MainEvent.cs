using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Warpweb.DataAccessLayer.Models
{
    public class MainEvent //Arrangementet. Events under arrangementet heter SubEvents
    {
        public int MainEventId { get; set; }
        public string MainEventName { get; set; }
        public DateTime MainEventStartTime { get; set; }
        public DateTime MainEventEndTime { get; set; }
        public virtual Venue Venue { get; set; }
    }
}
