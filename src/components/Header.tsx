import type { CronogramaTipo } from '../types/cronograma';
import TabSelector from './TabSelector';

interface HeaderProps {
    currentTab: CronogramaTipo;
    onTabChange: (tab: CronogramaTipo) => void;
}

const Header = ({ currentTab, onTabChange }: HeaderProps) => {
    return (
        <div className="header">
            <div className="header-content">
                <div className="logo-jlm-wrapper">
                    <img src="/img/logoJLM.jpg" alt="Logo JLM" className="logo-jlm" />
                </div>
                <div className="header-text">
                    <h1>Unidad Educativa Fiscal Juan León Mera</h1>
                    <p>Sistema integral de gestión y visualización de cronogramas</p>
                </div>
            </div>
            <div className="header-tabs">
                <TabSelector currentTab={currentTab} onTabChange={onTabChange} />
            </div>
        </div>
    );
};

export default Header;
