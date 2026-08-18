import styled from 'styled-components/native';

const Block = styled.View`
  padding: 20px 16px 8px 16px;
`;

const TitleRow = styled.View`
  flex-direction: row;
  align-items: stretch;
`;

const Accent = styled.View`
  width: 3px;
  background-color: ${({ theme }) => theme.colors.accentCyan};
  margin-right: 10px;
`;

const Title = styled.Text`
  flex: 1;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.size.xxl}px;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  letter-spacing: 1px;
`;

const Kicker = styled.Text`
  margin-top: 6px;
  margin-left: 13px;
  color: ${({ theme }) => theme.colors.accentCyan};
  font-size: ${({ theme }) => theme.typography.size.xs}px;
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  letter-spacing: 0.8px;
`;

export interface CategoryHeroProps {
  title: string;
  kicker?: string;
}

export function CategoryHero({ title, kicker }: CategoryHeroProps) {
  return (
    <Block>
      <TitleRow>
        <Accent />
        <Title>{title}</Title>
      </TitleRow>
      {kicker ? <Kicker>{kicker}</Kicker> : null}
    </Block>
  );
}
