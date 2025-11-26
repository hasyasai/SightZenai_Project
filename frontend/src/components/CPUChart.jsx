
import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend)

export default function CPUChart({data}){
  return (
    <Line data={{
      labels: data ? data.map((_,i)=>i+1):[],
      datasets: [{ label:'CPU %', data:data||[], borderColor:'#00fff7', backgroundColor:'rgba(0,255,247,0.14)', fill:true, tension:0.4 }]
    }} options={{
      plugins:{ legend:{ labels:{ color:'#ffffff' } } },
      scales:{
        x:{ ticks:{ color:'#a8fff0' }, grid:{ color:'rgba(255,255,255,0.03)'} },
        y:{ ticks:{ color:'#a8fff0' }, grid:{ color:'rgba(255,255,255,0.03)'} }
      }
    }} />
  )
}
