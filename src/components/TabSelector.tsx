import type { CronogramaTipo } from '../types/cronograma';

interface TabSelectorProps {
    currentTab: CronogramaTipo;
    onTabChange: (tab: CronogramaTipo) => void;
}

const TabSelector = ({ currentTab, onTabChange }: TabSelectorProps) => {
    const tabs: { id: CronogramaTipo; label: string; icon: string }[] = [
        { id: 'inicio', label: 'Eventos Próximos', icon: '📅' },
        { id: 'academico', label: 'Cronograma Escolar', icon: '📚' },
        { id: 'civico', label: 'Momentos Cívicos', icon: '🏛️' },
        { id: 'vicerrectorado', label: 'Documentos Solicitados', icon: '📋' }
    ];

    return (
        <div className="tab-container">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    className={`tab-button ${currentTab === tab.id ? 'active' : ''}`}
                    onClick={() => onTabChange(tab.id)}
                >
                    {tab.icon} {tab.label}
                </button>
            ))}
        </div>
    );
};

export default TabSelector;
