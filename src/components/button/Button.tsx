import { ICON_MAP } from '../../utils/icons'
import _ from 'lodash'
import style from './button.module.css'
import MenuBarMobile from '../mobile/menu-bar/MenuBarMobile'
import { MENU_ITEMS } from '../../utils/constants'

type Button = {
  buttonAction: React.MouseEventHandler<HTMLButtonElement>,
  title: string,
  content: string,
  children?: React.ReactNode,
}
export default function Button({ title, buttonAction, children }: Button) {
  let context: React.ReactNode = title;
  switch (title) {
    case 'menu':
      context = ICON_MAP['MENU']
      break;
    default:
      break;
  }
  return <button className={style.calculatorButton} onClick={buttonAction}>{children}</button>
}

