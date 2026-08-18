import { ScrollView } from 'react-native';
import { router } from 'expo-router';
import styled from 'styled-components/native';
import { useRelatedItems } from '../../hooks/useRelatedItems';
import { CATEGORY_ROUTE } from '../../constants/categories';
import type { CatalogRelatedGroup } from '../../types/catalog';
import { CatalogCard } from './CatalogCard';

const Section = styled.View`
  margin-top: 28px;
`;

const Header = styled.Text`
  margin-bottom: 12px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.size.md}px;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  letter-spacing: 0.8px;
  text-transform: uppercase;
`;

const ChipRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

const Chip = styled.Pressable`
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 10px 14px;
`;

const ChipLabel = styled.Text`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.size.sm}px;
`;

const CardWrap = styled.View`
  width: 180px;
  margin-right: 12px;
`;

export interface RelatedSectionProps {
  group: CatalogRelatedGroup;
}

export function RelatedSection({ group }: RelatedSectionProps) {
  const items = useRelatedItems(group.category, group.ids);

  if (items.length === 0) {
    return null;
  }

  const showCards = group.category === 'films' || group.category === 'planets';

  return (
    <Section>
      <Header>{group.title}</Header>
      {showCards ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {items.map((item) => (
            <CardWrap key={item.id}>
              <CatalogCard
                item={item}
                imageAspect={group.category === 'films' ? 2 / 3 : 1}
                onPress={() => router.push(`${CATEGORY_ROUTE[group.category]}/${item.id}`)}
              />
            </CardWrap>
          ))}
        </ScrollView>
      ) : (
        <ChipRow>
          {items.map((item) => (
            <Chip
              key={item.id}
              onPress={() => router.push(`${CATEGORY_ROUTE[group.category]}/${item.id}`)}
              accessibilityRole="button"
              accessibilityLabel={item.title}
            >
              <ChipLabel>{item.title}</ChipLabel>
            </Chip>
          ))}
        </ChipRow>
      )}
    </Section>
  );
}
