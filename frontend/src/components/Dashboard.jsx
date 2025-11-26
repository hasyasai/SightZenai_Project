
import React, {useEffect,useState} from 'react'
import axios from 'axios'
import CPUChart from './CPUChart'

export default function Dashboard(){
  const [data,setData] = useState(null)

  useEffect(()=>{ axios.get('http://localhost:5000/dashboard').then(r=>setData(r.data.data)).catch(()=>{}) },[])

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 neon-text-lime">System Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="Severe Incidents" value={data?.severe_incidents}/>
        <Card title="High Priority Down" value={data?.high_priority_down}/>
        <Card title="Top Service" value={data?.top_service}/>
        <Card title="Prediction" value={data?.prediction}/>
      </div>

      <div className="mt-8 glass p-6 rounded-xl neon-border">
        <h3 className="text-xl mb-3 neon-text-cyan">CPU Trend</h3>
        <div style={{height:240}}>
          <CPUChart data={data?.cpu_trend_24h}/>
        </div>
      </div>
    </div>
  )
}

function Card({title,value}){
  return (
    <div className="p-4 rounded-xl"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid #00fff7",
        boxShadow: "0 0 12px #00fff7",
      }}
    >
      <div style={{color:"#ff00e6"}}>{title}</div>
      <div style={{fontSize:"1rem", color:"#c8ff00", fontWeight:"bold"}}>{value ?? '--'}</div>
    </div>
  );
}

