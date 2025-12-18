import style from "./button.module.css"
type Button = {
  onClickAction?: React.MouseEventHandler<HTMLButtonElement>,
  title: string
}
export default function Button({ onClickAction, title }: Button) {
  return (<button className={style.buttonYellow} onClick={onClickAction}>{title}</button>)
}
