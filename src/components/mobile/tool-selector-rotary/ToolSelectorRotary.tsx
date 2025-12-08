import style from './toolSelectorRotary.module.css'
export default function ToolSelectorRotary() {
  return (
    <div className={style.toolContainer}>
      <div className={style.dial}>
        <input type="range" className={style.dimple} style={{ top: '20%', left: '50%' }} />
      </div>
    </div>

  )
}