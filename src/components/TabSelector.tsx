import type { CronogramaTipo } from '../types/cronograma';

interface TabSelectorProps {
    currentTab: CronogramaTipo;
    onTabChange: (tab: CronogramaTipo) => void;
}

const TabSelector = ({ currentTab, onTabChange }: TabSelectorProps) => {
    const tabs: { id: CronogramaTipo; label: string; icon: string }[] = [
        { id: 'inicio', label: 'Eventos Próximos', icon: '📅' },
        { id: 'academico', label: 'Cronograma', icon: '📚' },
        { id: 'civico', label: 'Momentos Cívicos', icon: '🏛️' },
        { id: 'vicerrectorado', label: 'Documentos', icon: '📋' },
        { id: 'talleres', label: 'Talleres aPadres', icon: '👨‍👩‍👧‍👦' },
        { id: 'visitas', label: 'Visitas Aúlicas', icon: '🏫' }
    ];

    return (
        <nav className="tab-navigation">
            {tabs.map(tab => (
                <a
                    key={tab.id}
                    href="#"
                    className={`tab-link ${currentTab === tab.id ? 'active' : ''}`}
                    onClick={(e) => {
                        e.preventDefault();
                        onTabChange(tab.id);
                    }}
                >
                    <span className="tab-icon">{tab.icon}</span>
                    <span className="tab-label">{tab.label}</span>
                </a>
            ))}
        </nav>
    );
};

export default TabSelector;
