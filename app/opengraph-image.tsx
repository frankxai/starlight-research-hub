import { ImageResponse } from 'next/og'
export const alt='Starlight Research: Better models. Better decisions. Large language model hub.'
export const size={width:1200,height:630}
export const contentType='image/png'
export default function Image(){return new ImageResponse(<div style={{display:'flex',flexDirection:'column',justifyContent:'space-between',width:'100%',height:'100%',background:'#101819',color:'#eef1e9',padding:'64px',fontFamily:'sans-serif'}}><div style={{display:'flex',fontSize:26,color:'#a5cfbd'}}>Starlight / Research</div><div style={{display:'flex',flexDirection:'column',fontSize:84,letterSpacing:-4,lineHeight:1.05}}><span>Better models.</span><span style={{color:'#a5cfbd'}}>Better decisions.</span></div><div style={{display:'flex',justifyContent:'space-between',borderTop:'1px solid #40504b',paddingTop:24,fontSize:22}}><span>Model evidence · Workflow evaluation · Economics</span><span>September 2026</span></div></div>,size)}
