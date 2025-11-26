
import React,{useState,useRef,useEffect} from 'react'
import axios from 'axios'

export default function AIAssistant(){
  const [messages,setMessages]=useState([{from:'bot',text:'Welcome to SightZen ai — ask me anything!, like "Why CPU Spikes every morning at 9am?'}])
  const [input,setInput]=useState('')
  const bottomRef=useRef()

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:'smooth'}) },[messages])

  async function send(){
    if(!input) return
    setMessages(m=>[...m,{from:'user',text:input}])
    try{
      const res=await axios.post('http://localhost:5000/ask-ai',{query:input})
      setMessages(m=>[...m,{from:'bot',text:res.data.answer}])
    }catch(e){
      setMessages(m=>[...m,{from:'bot',text:'Backend Error'}])
    }
    setInput('')
  }

  return (
    <div className="glass p-6 rounded-xl neon-border">
      <div className="h-96 overflow-auto border border-[rgba(255,255,255,0.04)] rounded-lg p-4">
        {messages.map((m,i)=>(
          <div key={i} className={'my-3 '+(m.from==='user'?'text-right':'text-left')}>
            <div className={'inline-block px-4 py-2 rounded-xl '+(m.from==='user'?'bg-neon-magenta text-black':'bg-neon-cyan text-black')}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef}/>
      </div>

      <div className="flex gap-3 mt-4">
        <input
          className="flex-1 p-3 rounded-lg bg-[#03030a] border neon-border outline-none text-neon-lime"
          value={input}
          onChange={e=>setInput(e.target.value)}
          placeholder="Ask AI…"
          onKeyDown={e=>e.key==='Enter'&&send()}
        />
        <button onClick={send} className="px-5 py-2 bg-neon-purple text-black font-bold rounded-lg neon-border">
          Send
        </button>
      </div>
    </div>
  )
}
