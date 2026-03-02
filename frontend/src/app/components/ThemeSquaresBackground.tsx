import { useTheme } from '../contexts/ThemeContext';
import Squares from './Squares';

export function ThemeSquaresBackground() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <Squares
        speed={0.5}
        direction="diagonal"
        borderColor={isDark ? '#271E37' : '#cbd5e1'}
        hoverFillColor={isDark ? '#222222' : '#e2e8f0'}
        squareSize={40}
        fadeColor={isDark ? '#060010' : '#f8fafc'}
      />
    </div>
  );
}
