import styled from 'styled-components/native';
import type { CatalogStat, CatalogStatGroup } from '../../types/catalog';

const Section = styled.View`
  margin-top: 24px;
`;

const GroupTitle = styled.Text`
  margin-bottom: 10px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.size.xs}px;
  letter-spacing: 1px;
`;

const Rows = styled.View`
  gap: 8px;
`;

const Row = styled.View`
  flex-direction: row;
  gap: 8px;
`;

const Cell = styled.View`
  flex: 1;
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

function chunkStats(items: CatalogStat[]): CatalogStat[][] {
  const rows: CatalogStat[][] = [];
  for (let index = 0; index < items.length; index += 2) {
    rows.push(items.slice(index, index + 2));
  }
  return rows;
}

export interface StatsGridProps {
  groups: CatalogStatGroup[];
}

export function StatsGrid({ groups }: StatsGridProps) {
  return (
    <>
      {groups.map((group) => (
        <Section key={group.title ?? group.items.map((item) => item.label).join('-')}>
          {group.title ? <GroupTitle>{group.title}</GroupTitle> : null}
          <Rows>
            {chunkStats(group.items).map((row) => (
              <Row key={row.map((item) => item.label).join('-')}>
                {row.map((item) => (
                  <Cell key={item.label}>
                    <Label>{item.label}</Label>
                    <Value>{item.value}</Value>
                  </Cell>
                ))}
              </Row>
            ))}
          </Rows>
        </Section>
      ))}
    </>
  );
}
