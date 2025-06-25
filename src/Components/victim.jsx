import React,{useState,useEffect} from "react";
import './victim.css';
const Victim=()=>{
    const bgStyle = {
  backgroundImage: "url('/images/victimform_bg.jpg')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  minHeight: '92vh',
  paddingTop: '60px',
};
    const [form,setForm]=useState({
        name:'',
        location:'',
        typeOfHelp:'',
        description:'',
        urgency:'',
        photo:null,
    });
    // The getLocation function automatically detects the user’s current geographic location (latitude and longitude) using the browser’s built-in Geolocation API, and sets it into the location field of your form.
    const getLocation=()=>{
      if(navigator.geolocation){//Checks if the Geolocation API is supported by the user's browser.
         navigator.geolocation.getCurrentPosition((pos)=>{//When the location is successfully retrieved, the pos object contains:pos.coords.latitude – user's current latitude ,pos.coords.longitude – user's current longitude
            const coords=`Lat:${pos.coords.latitude},Lng:${pos.coords.longitude}`;
            setForm((prev)=>({...prev,location:coords}));
         });
      }
    };
    // The handleChange function in your React component is responsible for updating the form state whenever any input field changes. 
    const handleChange=(e)=>{
      const {name,value,files}=e.target;
      if(name==='photo'){
        setForm({...form,photo:files[0]});//If the field is photo, the file is taken from files[0] (only single file allowed) and stored in form.photo.
      }else{
        setForm({...form,[name]:value});//For all other inputs (like name, location, typeOfHelp, etc.), update the respective key in the state object.
      }
    }
    const handleSubmit=(e)=>{
      e.preventDefault();
      const requestData={...form,timestamp: new Date()}
      if(navigator.onLine){
         console.log("📡 Online - Send to API");
      }else {
      console.log("📴 Offline - Saved to localStorage");
      localStorage.setItem("offlineRequest", JSON.stringify(requestData));
      }
      alert("Request saved! (or queued if offline)");
      setForm({
        name: "",
        location: "",
        typeOfHelp: "",
        description: "",
        urgency: "",
        photo: null,
      });
    };
    // Sync if saved offline
    useEffect(()=>{
        if(navigator.onLine && localStorage.getItem("offlineRequest")){
          const offline=JSON.parse(localStorage.getItem("offlineRequest"));
          console.log("🛰 Syncing offline data:", offline);
          localStorage.removeItem("offlineRequest");
        }
    },[]);
    return(
        <>
        <div  style={bgStyle}> 
        <div className="victim-container">
            <h2>Help Request Form</h2>
            <form onSubmit={handleSubmit}>
               <input type="text" name="name" placeholder="Your Name" value={form.name} onChange={handleChange}/>
               <div className="location-row">
                  <input type="text" name="location" placeholder="Manual Location Pin" value={form.location} onChange={handleChange}/>
                  <button type="button" onClick={getLocation}>Auto Detect</button>
               </div>
               <select name="typeOfHelp" value={form.typeOfHelp} onChange={handleChange} required>
                <option value="">Type of Help</option>
                <option value="Medical">Medical</option>
                <option value="Shelter">Shelter</option>
                <option value="Food">Food</option>
                <option value="Rescue">Rescue</option>
               </select>
               <input type="file" name="photo" onChange={handleChange}/>
               <button type="submit">Submit Help Request</button>
            </form>
        </div>
        </div>
        </>
    );
}
export default Victim;