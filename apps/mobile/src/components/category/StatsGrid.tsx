import styled from 'styled-components/native';
import type { CatalogStatGroup } from '../../types/catalog';

const Section = styled.View`
  margin-top: 24px;
`;

const GroupTitle = styled.Text`
  margin-bottom: 10px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.size.xs}px;
  letter-spacing: 1px;
`;

const Grid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

const Cell = styled.View<{ $full?: boolean }>`
  width: ${({ $full }) => ($full ? '100%' : '48%')};
  background-color: ${({ theme }) => theme.colors.surface};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: 10px 12px;
`;

const Label = styled.Text`
  color: ${({ theme }) => theme.colors.accentCyan};
  font-size: ${({ theme }) => theme.typography.size.xs}px;
  letter-spacing: 0.7px;
`;

const Value = styled.Text`
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.size.sm}px;
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`;

export interface StatsGridProps {
  groups: CatalogStatGroup[];
}

export function StatsGrid({ groups }: StatsGridProps) {
  return (
    <>
      {groups.map((group) => (
        <Section key={group.title ?? group.items.map((item) => item.label).join('-')}>
          {group.title ? <GroupTitle>{group.title}</GroupTitle> : null}
          <Grid>
            {group.items.map((item, index) => (
              <Cell
                key={item.label}
                $full={group.items.length % 2 === 1 && index === group.items.length - 1}
              >
                <Label>{item.label}</Label>
                <Value>{item.value}</Value>
              </Cell>
            ))}
          </Grid>
        </Section>
      ))}
    </>
  );
}
