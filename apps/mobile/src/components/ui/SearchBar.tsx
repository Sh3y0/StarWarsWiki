import { Ionicons } from '@expo/vector-icons';
import styled, { useTheme } from 'styled-components/native';

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.surface};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 0 12px;
`;

const Input = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: theme.colors.textSecondary,
}))`
  flex: 1;
  padding: 12px 0 12px 8px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.size.md}px;
`;

export interface SearchBarProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = 'Search...' }: SearchBarProps) {
  const theme = useTheme();

  return (
    <Row>
      <Ionicons name="search" size={16} color={theme.colors.accentCyan} />
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel="Search"
      />
    </Row>
  );
}
