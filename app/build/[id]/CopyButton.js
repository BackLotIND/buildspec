"use client"
import { useState } from 'react'

export default function CopyButton({ url }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(url) } catch(e) {}
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy} style={{padding:"10px 20px",borderRadius:8,border:"none",background:copied?"#2EC4B6":"#E63946",color:copied?"#000":"#fff",fontSize:"0.85rem",fontWeight:700,cursor:"pointer",transition:"background 0.2s",width:"100%",marginBottom:8}}>
      {copied ? "✅ Copied!" : "📋 Copy Link"}
    </button>
  )
}
