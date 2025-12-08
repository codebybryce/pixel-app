// ...existing code...
import { useState, useRef } from 'react';
import { MENU_ITEMS, FILE_MENU, EDIT_MENU, VIEW_MENU, HELP_MENU, IMAGE_MENU } from '../utils/constants';
import useMediaType from '../hooks/useMediaType';
import { ICON_MAP } from '../utils/icons';
import _ from 'lodash';
// Helper to dispatch custom events for App-level actions
function triggerAppAction(action: string, detail?: any) {
    window.dispatchEvent(new CustomEvent('pixel-app-action', { detail: { action, ...detail } }));
}

function handleMenuAction(menu: string, item: string) {
    // File menu
    if (menu === 'File') {
        if (item === 'New') triggerAppAction('clear');
        if (item === 'Open') triggerAppAction('open');
        if (item === 'Save') triggerAppAction('save');
        if (item === 'Save As') triggerAppAction('saveAs');
        if (item === 'Export PNG') triggerAppAction('export');
        if (item === 'Export STL') triggerAppAction('exportSTL');
        if (item === 'Export Blender') triggerAppAction('exportBlender');
    }
    // Edit menu
    if (menu === 'Edit') {
        if (item === 'Undo') triggerAppAction('undo');
        if (item === 'Redo') triggerAppAction('redo');
        if (item === 'Cut') triggerAppAction('cut');
        if (item === 'Copy') triggerAppAction('copy');
        if (item === 'Paste') triggerAppAction('paste');
    }
    // View menu
    if (menu === 'View') {
        if (item === 'Zoom In') triggerAppAction('zoomIn');
        if (item === 'Zoom Out') triggerAppAction('zoomOut');
        if (item === 'Reset Zoom') triggerAppAction('resetZoom');
    }
    // Image menu
    if (menu === 'Image') {
        if (item === 'Flip Horizontal') triggerAppAction('Flip Horizontal');
        if (item === 'Flip Vertical') triggerAppAction('Flip Vertical');
        if (item === 'Rotate Left') triggerAppAction('Rotate Left');
        if (item === 'Rotate Right') triggerAppAction('Rotate Right');
    }
    // Help menu
    if (menu === 'Help') {
        if (item === 'Documentation') window.open('https://github.com/codebybryce/pixel-app', '_blank');
        if (item === 'About') alert('Pixel App\nVersion 1.0.0\nBy codebybryce');
    }
}


const SUB_MENU_MAP: { [key: string]: string[] } = {
    File: FILE_MENU,
    Edit: EDIT_MENU,
    View: VIEW_MENU,
    Help: HELP_MENU,
    Image: IMAGE_MENU
}

export default function MenuBar() {
    const [selectedMenuOpen, setSelectedMenuOpen] = useState<boolean | undefined>(undefined)
    function menuRender(selectedOption: string) {
        switch (selectedOption) {
            case 'File':
                return FILE_MENU;
            case 'Edit':
                return EDIT_MENU;
            case 'View':
                return VIEW_MENU;
            case 'Help':
                return HELP_MENU;
            case 'Image':
                return IMAGE_MENU;
            default:
                return [];
        }
    }


    if (typeof window !== 'undefined') {
        window.removeEventListener('pixel-app-close-menu', closeMenuBar);
        window.addEventListener('pixel-app-close-menu', closeMenuBar);
    }
    function closeMenuBar() {
        setSelectedMenuOpen(undefined);
    }




    const mediaType = useMediaType();





    return (
        <>
            <header className="fixed top-0 h-3rem left-0 right-0 z-50 bg-gray-50 dark:bg-black shadow-sm">
                {mediaType === "mobile" && <MobileMenu />}
            </header>
        </>

    )

}
// ...existing code...


const MobileMenu = () => {
    const [selectedMenuOpen, setSelectedMenuOpen] = useState(false)
    const [expandedMenu, setExpandedMenu] = useState<string | undefined>(undefined);

    function handleMenuItemClick(menu: string, item: string) {
        handleMenuAction(menu, item)
        setSelectedMenuOpen(false)
    }

    return (
        <>
            <div className="flex justify-between z-50">
                <div className="flex">
                    <button
                        id="mobile-menu"
                        className="text-gray-700 hover:text-blue-600 focus:outline-none p-2"
                        aria-label="Toggle mobile menu"
                        onClick={() => setSelectedMenuOpen(!selectedMenuOpen)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <img src="/logo.png" alt="Logo" className="h-100% w-11" />
                </div>

            </div>
            <div className={`fixed flex pl-2 top-12.5 w-8/12 h-full ${selectedMenuOpen ? 'left-0' : '-left-full'} bottom-0 z-50 bg-gray-50 dark:bg-black shadow-sm gap-3`} style={{ paddingLeft: '16px' }}>
                <ul>
                    {MENU_ITEMS.map((v: string) => {
                        return (
                            <>
                                <li key={v} className=""><button onClick={() => {
                                    expandedMenu === undefined ? setExpandedMenu(v) : setExpandedMenu(undefined)

                                }} className='flex justify-between text-[1.5rem] text-black m-4 w-full'>{v} <span className='scale-50'>{ICON_MAP['CARAT']}</span></button></li>
                                {expandedMenu === v
                                    ? <ul>

                                        {SUB_MENU_MAP[v]?.map((s, i) => {
                                            const sn = _.upperCase(s).replace(' ', '_');
                                            return (<li key={i} className='w-full' >
                                                <button className='text-[1rem] text-black m-4 w-full' onClick={() => handleMenuItemClick(v, s)}>
                                                    <span className='flex w-full gap-2'>{ICON_MAP[sn as keyof typeof ICON_MAP]}{s}</span>
                                                </button>

                                            </li>)
                                        })}


                                    </ul>
                                    : ""}
                            </>
                        )
                    }
                    )}
                </ul>
            </div >
            <div style={{ display: selectedMenuOpen ? 'block' : 'none' }} onClick={() => setSelectedMenuOpen(false)} className={`size-full h-dvh bg-black:20 absolute touch-none overscroll-none backdrop-blur-sm`}></div>
        </>

    )

}