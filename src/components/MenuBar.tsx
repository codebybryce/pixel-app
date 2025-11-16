
import { useState, useRef } from 'react';
import { MENU_ITEMS, FILE_MENU, EDIT_MENU, VIEW_MENU, HELP_MENU, IMAGE_MENU } from '../utils/constants';

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
    // View menu
    if (menu === 'Image') {
        if (item === '') triggerAppAction('zoomIn');
        if (item === 'Zoom Out') triggerAppAction('zoomOut');
        if (item === 'Reset Zoom') triggerAppAction('resetZoom');
    }
    // Help menu
    if (menu === 'Help') {
        if (item === 'Documentation') window.open('https://github.com/codebybryce/pixel-app', '_blank');
        if (item === 'About') alert('Pixel App\nVersion 1.0.0\nBy codebybryce');
    }
}


export default function MenuBar() {
    const [selectedMenuOpen, setSelectedMenuOpen] = useState<string | undefined>(undefined)
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

    // Listen for a custom event to close the menu
    // This allows App to close the menu bar on Escape
    // Only add/remove listener once
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (typeof window !== 'undefined') {
        window.removeEventListener('pixel-app-close-menu', closeMenuBar);
        window.addEventListener('pixel-app-close-menu', closeMenuBar);
    }
    function closeMenuBar() {
        setSelectedMenuOpen(undefined);
    }

    return (
        <div className="menu-bar">
            <img src="/src/assets/logo.png" alt="Logo" className="logo" style={{ height: '3rem' }}></img>
            {MENU_ITEMS.map((v: string, i: number) =>

                <div className="menu-stack" key={v}>
                    <button onClick={() => {
                        if (!selectedMenuOpen)
                            setSelectedMenuOpen(MENU_ITEMS[i])
                        else
                            setSelectedMenuOpen(undefined)
                    }
                    } className="menu-btn">{MENU_ITEMS[i]}</button>
                    {selectedMenuOpen === MENU_ITEMS[i] &&
                        <div className="sub-menu">
                            {menuRender(MENU_ITEMS[i]).map((item: string, key: number) => (
                                <li key={key} onClick={() => handleMenuAction(MENU_ITEMS[i], item)} style={{ cursor: 'pointer' }}>{item}</li>
                            ))}
                        </div>

                    }
                </div>
            )
            }

        </div>

    )

}