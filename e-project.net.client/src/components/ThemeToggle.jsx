import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-surface hover:bg-surface-hover transition-colors border border-border-color"
            title={theme === 'dark' ? 'Chế độ sáng' : 'Chế độ tối'}
        >
            <span className="text-sm font-medium text-text-primary">{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
    );
};

export default ThemeToggle;
