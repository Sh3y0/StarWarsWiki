import { ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { Card } from '../ui/Card';
import type { DatabankItem } from '../../types/databank';

const GridContent = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 16px;
`;

export interface CategoryGridProps {
  items: DatabankItem[];
  onItemPress?: (item: DatabankItem) => void;
}

export function CategoryGrid({ items, onItemPress }: CategoryGridProps) {
  return (
    <ScrollView>
      <GridContent>
        {items.map((item) => (
          <Card
            key={item.slug}
            title={item.title}
            imageUrl={item.images?.desktop?.desktop_1x1}
            onPress={onItemPress ? () => onItemPress(item) : undefined}
          />
        ))}
      </GridContent>
    </ScrollView>
  );
}
