import { useState } from "react";
import { ICON_MAP } from "../../../utils/icons"
import style from "./popUpMenu.module.css"
import { useGlobalStore } from "../../../store/useGlobalStore";
import { Joystick } from 'react-joystick-component';

type ScreenPosition = 'bl' | 'br' | 'tr' | 'tl';

type PopUpMenuProps = {
  title?: string,
  screenPosition?: ScreenPosition,
}

export default function PopUpMenu({ title, screenPosition }: PopUpMenuProps) {
  const { currColor } = useGlobalStore()
  const [modalOpen, setModalOpen] = useState(false)
  const positionMap: Record<ScreenPosition, React.CSSProperties> = {
    bl: { bottom: 0, left: 0 },
    br: { bottom: 0, right: 0 },
    tr: { top: 0, right: 0 },
    tl: { top: 0, left: 0 }
  };

  // const Modal = () => {
  //   return (

  //   )
  // }

  const colorIcon = () => <Joystick />
  // const colorIcon = () => <div onClick={() => setModalOpen(!modalOpen)} style={{ height: "40px", width: "40px", borderRadius: "50%", backgroundColor: currColor || "black" }} />

  return (<>
    <div className={style.popUpMenu} style={screenPosition ? positionMap[screenPosition] : {}}>
      <div className={style.iconContainer}>


        {modalOpen &&
          <div className={style.modal}>
            Test Modal
          </div>
        }

        {title === "tool" && ICON_MAP['TOOL']}
        {title === "color" && colorIcon()}

      </div>

    </div>
  </>)
}