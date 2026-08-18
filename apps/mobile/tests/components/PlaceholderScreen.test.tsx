import { render, screen } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import { theme } from '@/theme';
import { PlaceholderScreen } from '@/components/ui/PlaceholderScreen';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe('PlaceholderScreen', () => {
  it('renders the title', async () => {
    await renderWithTheme(<PlaceholderScreen title="Films" />);

    expect(screen.getByText('Films')).toBeTruthy();
  });

  it('renders the subtitle when provided', async () => {
    await renderWithTheme(<PlaceholderScreen title="Films" subtitle="Coming soon" />);

    expect(screen.getByText('Coming soon')).toBeTruthy();
  });

  it('omits the subtitle when not provided', async () => {
    await renderWithTheme(<PlaceholderScreen title="Films" />);

    expect(screen.queryByText('Coming soon')).toBeNull();
  });
});
