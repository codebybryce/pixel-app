import { useState } from 'react'
import style from "./menuBarMobile.module.css";
import Button from "../../button/Button";
import { ICON_MAP } from "../../../utils/icons";
import { MENU_ITEMS, FILE_MENU, EDIT_MENU, VIEW_MENU, IMAGE_MENU, HELP_MENU } from '../../../utils/constants';

const MenuBarMobile = () => {
  const [menuFullHeight, setMenuFullHeight] = useState(false)
  const [selectedSubMenu, setSelectedSubMenu] = useState('File')


  function triggerAppAction(action: string, detail?: any) {
    window.dispatchEvent(new CustomEvent('pixel-app-action', { detail: { action, ...detail } }));
  }

  function handleMenuAction(menu: string, item: string) {
    if (menu === 'File') {
      if (item === 'New') triggerAppAction('clear');
      if (item === 'Open') triggerAppAction('open');
      if (item === 'Save') triggerAppAction('save');
      if (item === 'Save As') triggerAppAction('saveAs');
      if (item === 'Export PNG') triggerAppAction('export');
      if (item === 'Export STL') triggerAppAction('exportSTL');
      if (item === 'Export Blender') triggerAppAction('exportBlender');
    }
    if (menu === 'Edit') {
      if (item === 'Undo') triggerAppAction('undo');
      if (item === 'Redo') triggerAppAction('redo');
      if (item === 'Cut') triggerAppAction('cut');
      if (item === 'Copy') triggerAppAction('copy');
      if (item === 'Paste') triggerAppAction('paste');
    }
    if (menu === 'View') {
      if (item === 'Zoom In') triggerAppAction('zoomIn');
      if (item === 'Zoom Out') triggerAppAction('zoomOut');
      if (item === 'Reset Zoom') triggerAppAction('resetZoom');
    }
    if (menu === 'Image') {
      if (item === 'Flip Horizontal') triggerAppAction('Flip Horizontal');
      if (item === 'Flip Vertical') triggerAppAction('Flip Vertical');
      if (item === 'Rotate Left') triggerAppAction('Rotate Left');
      if (item === 'Rotate Right') triggerAppAction('Rotate Right');
    }
    if (menu === 'Help') {
      if (item === 'Documentation') window.open('https://github.com/codebybryce/pixel-app', '_blank');
      if (item === 'About') alert('Pixel App\nVersion 1.0.0\nBy codebybryce');
    }
    setMenuFullHeight(false);
  }

  function handleSubMenuSelect(item: string) {
    setSelectedSubMenu(item)
  }

  const mockStatus = [
    { title: "loggedIn" },
  ]
  return (
    <>
      <div className={style.mobileMenu} style={{ height: `${menuFullHeight ? '40dvh' : '70px'}` }}>
        {!menuFullHeight && <div className={style.menuSection}>
          <p className={style.openClose} onClick={() => setMenuFullHeight(!menuFullHeight)}>{ICON_MAP['MENU']}</p>
          <p>Blaze Pixels</p>
          <div className={style.statusIcons}>
            {mockStatus.map(v => <div className={style.status}>{v.title}</div>)}
          </div>
        </div>}
        {menuFullHeight &&
          <>
            <div className={style.menuGrid}>
              <p className={style.openClose} onClick={() => setMenuFullHeight(!menuFullHeight)}>{ICON_MAP['CLOSE']}</p>
              {MENU_ITEMS.map(m =>
                <li key={m} className={style.list} style={{ borderBottom: `${selectedSubMenu === m ? "2px dotted #041c06" : "none"}` }} onClick={() => handleSubMenuSelect(m)}>{m}</li>
              )}
            </div>
            <div className={style.subMenu}>
              {(function getSubMenu() {
                let items: string[] = []
                switch (selectedSubMenu) {
                  case 'File':
                    items = FILE_MENU
                    break
                  case 'Edit':
                    items = EDIT_MENU
                    break
                  case 'View':
                    items = VIEW_MENU
                    break
                  case 'Image':
                    items = IMAGE_MENU
                    break
                  case 'Help':
                    items = HELP_MENU
                    break
                  default:
                    items = []
                }
                return (
                  <ul className={style.subList}>
                    {items.map(it => <li key={it} className={style.subListItem} onClick={() => handleMenuAction(selectedSubMenu, it)}>{it}</li>)}
                  </ul>
                )
              })()}
            </div>
          </>
        }
      </div>
    </>
  )
}

export default MenuBarMobile