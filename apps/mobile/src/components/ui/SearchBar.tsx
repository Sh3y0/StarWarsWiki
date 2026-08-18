import styled from 'styled-components/native';

const Input = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: theme.colors.textSecondary,
}))`
  background-color: ${({ theme }) => theme.colors.surface};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 12px 14px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.size.md}px;
`;

export interface SearchBarProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = 'Search...' }: SearchBarProps) {
  return (
    <Input
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      autoCapitalize="none"
      autoCorrect={false}
      accessibilityLabel="Search"
    />
  );
}
