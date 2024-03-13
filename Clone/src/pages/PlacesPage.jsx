import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Perks from "../Perks";
import axios from "axios";

export default function PlacesPage(){
    const {action} = useParams();
    const [title,setTitle] = useState('');
    const [address,setAddress]= useState('');
    const [photoLink,setPhotoLink] = useState('');
    const [addPhotos,setAddPhotos] = useState([]);
    const [description,setDescription] = useState('');
    const [perks,SetPerks] = useState([]);
    const [extraInfo,setExtraInfo] = useState('');
    const [checkIn,setCheckIn]=useState('');
    const [checkOut,setCheckOut]=useState('');
    const [maxGuest,setMaxGuest]=useState(1);
    function inputHeader(text){
      return(
          <h2 className="text-2xl mt-4">{text}</h2>
      );
    }
    function inputDescription(text){
      return(
          <p className="text-gray-500 text-sm">{text}</p>
      );
    }
    function preInput(header,description){
      return (
        <>
        {inputHeader(header)}
        {inputDescription(description)}
        </>
      );
    }
    async function addPhotoByLink(ev){
      ev.preventDefault();
     const {data:filename} = await axios.post('/upload-by-link',{link:photoLink});
     setAddPhotos(prev=>{
      return [...prev,filename];
     });
      setPhotoLink('');
    }
    // to upload from pc
    function uploadPhoto(ev){
      const files =  ev.target.files;
      const data = new FormData();
      for(let i = 0;i<files.length;i++)
      {
        data.append('photos',files[i]);
      }
      
      axios.post('/upload',data,{
        headers:{'Content-type':'multipart/form-data'}
      }).then(response=>{
        const {data:filenames} = response
        setAddPhotos(prev=>{
         return [...prev,...filenames];
        });
      }

      )
      console.log({files});

    }
    return(
        <div>
            {action !== 'new' && (

<div className="text-center">
<Link className="bg-primary inline-flex gap-1 text-white px-6 py-2 rounded-full " to = {'/account/places/new'}>
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</svg>

    Add new places</Link>
</div>
            )}
            {action==='new' && (
                 <div>
                    <form action="">
                        {preInput('Title','Title for your place,for advertisement')}
                        {/* <h2 className="text-2xl mt-4" >Title</h2>
                        <p className="text-sm text-gray-500">Title for your place,for advertisement</p> */}
                        <input type="text" value={title} onChange={ev=>setTitle(ev.target.value)} placeholder="title,for example : My lovely Apartment" />
                        {preInput('Address','Provide address for this apartment')}
                        {/* <h2 className="text-2xl mt-4" >Address</h2>
                        <p className="text-sm text-gray-500">Provide address for this apartment</p> */}
                        <input type="text" value={address} onChange={ev=>setAddress(ev.target.value)} placeholder="address" />
                        {preInput('Photos','more=better')}
                        {/* <h2 className="text-2xl mt-4" >Photos</h2>
                        <p className="text-sm text-gray-500">more=better</p> */}
                       <div className="flex gap-2">
                       <input value={photoLink} onChange={ev=>setPhotoLink(ev.target.value)} type="text" placeholder={'Add using a link ...jpg'} />
                       <button onClick={addPhotoByLink} className="bg-gray-200 rounded-2xl px-4" >Add&nbsp;photo</button>
                       </div>
                       
                        <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                          {addPhotos.length>0 && addPhotos.map(link=>(
                            <div className="h-32 flex">
                              {/* to display photo which is in uploads folder through link */}
                              <img className="rounded-2xl w-full" src={'http://localhost:4000/uploads/'+link} alt="" />
                            </div>
                          ))}
                          {/* we have changed upload button to label ,so that we can upload pics from our pc */}
                        <label  className="h-32 cursor-pointer flex items-center gap-1 justify-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-600" >
                        <input type="file" multiple className="hidden" onChange={uploadPhoto}/>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
</svg>

                            Upload</label>    
                        </div>
                        <div>
                        {preInput('Description','description of the place')}
                        {/* <h2 className="text-2xl mt-4" >Description</h2>
                        <p className="text-sm text-gray-500">description of the place</p> */}
                         <textarea value={description} onChange={ev=>setDescription(ev.target.description)} />
                        </div>
                        {preInput('Perks','Select all the perks available')}
                        {/* <h2 className="text-2xl mt-4" >Perks</h2>
                        <p className="text-sm text-gray-500">Select all the perks available</p> */}
                         <Perks selected={perks} onChange={SetPerks}/>
                            {preInput('Extra Info','house rules ,etc')}
                        
                            {/* <h2 className="text-2xl mt-4" >Extra Info</h2>
                        <p className="text-sm text-gray-500">house rules ,etc</p> */}
                        <textarea value={extraInfo} onChange={ev=>setExtraInfo(ev.target.value)} />
                        {preInput('Check-In, Check-Out & Max guest','Make sure to cleans the apartment between guest')}
                        {/* <h2 className="text-2xl mt-4" >Check-In, Check-Out & Max guest</h2>
                        <p className="text-sm text-gray-500">Make sure to cleans the apartment between guest</p> */}
                        <div className="grid gap-2 sm:grid-cols-3">
                            <div className="mt-2 -mb-1">
                               <h3>Check In Time</h3> 
                             <input type="text" value={checkIn} onChange={ev=>setCheckIn(ev.target.value)} placeholder="14:00"/>
                            </div>
                            <div className="mt-2 -mb-1">
                            <h3>Check Out Time</h3>
                            <input type="text" value={checkOut} onChange={ev=>setCheckOut(ev.target.value)} placeholder="10:00"/>
                            </div>
                            <div className="mt-2 -mb-1">
                            <h3>Max Guest Allowed</h3>
                            <input type="number" value={maxGuest} onChange={ev=>setMaxGuest(ev.target.value)} placeholder="3"/>
                            </div>
                        </div>
                      <button className="primary my-4">Save</button>
                    </form>
                 </div>
            )}
           
        </div>
    )
}