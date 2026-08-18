import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 24px;
`;

const Title = styled.Text`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.size.xl}px;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`;

const Subtitle = styled.Text`
  margin-top: 8px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.size.sm}px;
  text-align: center;
`;

export interface PlaceholderScreenProps {
  title: string;
  subtitle?: string;
}

export function PlaceholderScreen({ title, subtitle }: PlaceholderScreenProps) {
  return (
    <Container>
      <Title>{title}</Title>
      {subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
    </Container>
  );
}
