
import{ MENU_ITEMS , FILE_MENU, EDIT_MENU }from '../utils/constants';

export default function MenuBar({ menu }: { menu: string[] }) {
    return (
        <div className="menu-bar">
            <img src="/src/assets/logo.png" alt="Logo" className="logo" style={{height:'3rem'}}></img>
            {MENU_ITEMS.map((m, i) => <div key={i} className="menu-item">{m}</div>)}
            <div className="menu-dropdown">
                <div className="menu-item">File</div>
                <div className="dropdown-content">
                    {/* {FILE_MENU.map((item, i) => <div key={i} className="dropdown-item">{item}</div>)} */}
                </div>
            </div>
        </div>

    );
}