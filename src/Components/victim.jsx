import React,{useState,useEffect} from "react";
import './victim.css';
const Victim=()=>{
    const [form,setForm]=useState({
        name:'',
        location:'',
        typeOfHelp:'',
        description:'',
        urgency:'',
        photo:null,
    });
    const handleSubmit=(e)=>{
      e.prevenDefault();
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
        <div className="victim-container">
            <h2>Help Request Form</h2>
            <form onSubmit={handleSubmit}>

            </form>
        </div>
        </>
    );
}
export default Victim;