export default function BookingWidget({place}){
    return(
        <div className="bg-white shadow p-4 rounded-2xl">
        <div className="text-2xl text-center">
            Price: Rs.{place.price} /per night
        </div>
        <div className="border rounded-2xl mt-4">
            <div className="flex">
            <div className="  py-3 px-4">
            <label >Check in :</label>
            <input type="date"  />
        </div>
        <div className="  py-3 px-4 border-l ">
            <label >Check out:</label>
            <input type="date"  />
        </div>
            </div>
            <div className="py-3 px-4 border-t">
            <label htmlFor=""> Number of Guest :</label>
              <input type="number" name="" id="" value={1} />
        </div>
        </div>
        
        <button className=" mt-4 primary" >Book this place</button>
        </div>
    );
}