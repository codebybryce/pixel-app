
import { useState } from 'react';
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


export default function MenuBar({ user, onSignIn, onSignOut, isSaved, lastSavedAt, networkLoading }: { user?: any; onSignIn?: () => void; onSignOut?: () => void; isSaved?: boolean; lastSavedAt?: string | null; networkLoading?: boolean }) {
    const [selectedMenuOpen, setSelectedMenuOpen] = useState<string | undefined>(undefined)
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);
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

    function toggleMobile() {
        // toggle local mobile state for menu rendering
        setMobileOpen(o => !o);
        // notify App that mobile menu should open/close (App listens for this event)
        window.dispatchEvent(new CustomEvent('pixel-app-toggle-mobile-menu'));
        // close any desktop submenus when opening mobile
        if (!mobileOpen) setSelectedMenuOpen(undefined);
    }

    return (
        <div className="menu-bar">
            <img src="/logo.png" alt="Logo" className="logo" style={{ height: '3rem' }} />
            <button className="hamburger" aria-label="Open menu" title="Open menu" onClick={toggleMobile}>
                <span />
                <span />
                <span />
            </button>

            <div className="menu-desktop">
                {MENU_ITEMS.map((v: string) =>
                    <div className="menu-stack" key={v}>
                        <button onClick={() => {
                            if (!selectedMenuOpen)
                                setSelectedMenuOpen(v)
                            else
                                setSelectedMenuOpen(undefined)
                        }} className="menu-btn">{v}</button>
                        {selectedMenuOpen === v &&
                            <div className="sub-menu">
                                {menuRender(v).map((item: string, key: number) => (
                                    <li key={key} onClick={() => handleMenuAction(v, item)} style={{ cursor: 'pointer' }}>{item}</li>
                                ))}
                            </div>

                        }
                    </div>
                )}
            </div>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="saved-badge" style={{ marginLeft: 'auto', marginRight: 8 }}>
                    <div className="saved-dot" style={{ background: isSaved ? '#4CAF50' : '#FFB300', boxShadow: networkLoading ? '0 0 8px rgba(255,183,0,0.5)' : undefined }} aria-hidden />
                    <div style={{ color: '#ccc', fontSize: 12 }}>{isSaved ? 'Saved' : 'Unsaved'}</div>
                    {lastSavedAt && <div style={{ color: '#9aa', fontSize: 11, marginLeft: 8 }}>• {new Date(lastSavedAt).toLocaleString()}</div>}
                </div>
                {user ? (
                    <>
                        <span style={{ color: '#ffb300' }}>Hi, {user.displayName || user.email}</span>
                        <button onClick={onSignOut} className="menu-btn" title="Sign Out">Sign Out</button>
                    </>
                ) : (
                    <button onClick={onSignIn} className="menu-btn" title="Sign In">Sign In</button>
                )}
            </div>

            {mobileOpen && (
                <div className="mobile-menu">
                    <button className="mobile-close" onClick={() => setMobileOpen(false)}>Close</button>
                    <div className="mobile-items">
                        {MENU_ITEMS.map((menu) => (
                            <details key={menu} className="mobile-details">
                                <summary>{menu}</summary>
                                <ul>
                                    {menuRender(menu).map((item) => (
                                        <li key={item} onClick={() => { handleMenuAction(menu, item); setMobileOpen(false); }} style={{ cursor: 'pointer' }}>{item}</li>
                                    ))}
                                </ul>
                            </details>
                        ))}
                    </div>
                </div>
            )}

        </div>
    )

}