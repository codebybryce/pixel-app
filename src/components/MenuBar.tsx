import { useState, useRef } from 'react'
import { MENU_ITEMS, FILE_MENU, EDIT_MENU, VIEW_MENU, HELP_MENU } from '../utils/constants';


export default function MenuBar() {
    const [selectedMenuOpen, setSelectedMenuOpen] = useState<string | undefined>(undefined)
    function menuRender(selectedOption: string) {
        switch (selectedOption) {
            case 'File':
                return FILE_MENU; ``
            case 'Edit':
                return EDIT_MENU;
            case 'View':
                return VIEW_MENU;
            case 'Help':
                return HELP_MENU;
            default:
                return [];
        }
    }

    return (
        <div className="menu-bar">
            <img src="/src/assets/logo.png" alt="Logo" className="logo" style={{ height: '3rem' }}></img>
            {MENU_ITEMS.map((v: string, i: number) =>

                <div className="menu-stack">
                    <button onClick={() => {
                        if (!selectedMenuOpen)
                            setSelectedMenuOpen(MENU_ITEMS[i])
                        else
                            setSelectedMenuOpen(undefined)
                    }
                    }>{MENU_ITEMS[i]}</button>
                    {selectedMenuOpen === MENU_ITEMS[i] &&
                        <div className="sub-menu">
                            {menuRender(MENU_ITEMS[i]).map((item: string, key: number) => <li key={key}>{item}</li>)}
                        </div>

                    }
                </div>
            )
            }

        </div>

    )

}