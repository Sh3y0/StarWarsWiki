import { ActivityIndicator, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { Image } from 'expo-image';
import styled, { useTheme } from 'styled-components/native';
import { useCatalogDetail } from '../../hooks/useCatalogDetail';
import { PlaceholderScreen } from '../ui/PlaceholderScreen';
import { RelatedSection } from './RelatedSection';
import { StatsGrid } from './StatsGrid';
import type { CatalogCategory } from '../../types/catalog';

const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Centered = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Hero = styled(Image)`
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: ${({ theme }) => theme.colors.surfaceAlt};
`;

const Content = styled.View`
  padding: 20px 16px 40px 16px;
`;

const Kicker = styled.Text`
  color: ${({ theme }) => theme.colors.accentCyan};
  font-size: ${({ theme }) => theme.typography.size.xs}px;
  letter-spacing: 1px;
`;

const Title = styled.Text`
  margin-top: 6px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.size.xl}px;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  text-transform: uppercase;
`;

const Subtitle = styled.Text`
  margin-top: 6px;
  color: ${({ theme }) => theme.colors.accentCyan};
  font-size: ${({ theme }) => theme.typography.size.sm}px;
  letter-spacing: 0.8px;
`;

const Description = styled.Text`
  margin-top: 16px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.size.md}px;
  line-height: 22px;
`;

export interface CategoryDetailScreenProps {
  category: CatalogCategory;
  id?: string;
}

export function CategoryDetailScreen({ category, id }: CategoryDetailScreenProps) {
  const theme = useTheme();
  const { data, isLoading, isError } = useCatalogDetail(category, id);

  if (isLoading) {
    return (
      <Centered>
        <ActivityIndicator size="large" color={theme.colors.accentCyan} />
      </Centered>
    );
  }

  if (isError || !data) {
    return <PlaceholderScreen title="Not found" subtitle={`No record matches "${id ?? ''}"`} />;
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: data.title }} />
      <ScrollView>
        {data.imageUrl ? <Hero source={{ uri: data.imageUrl }} contentFit="cover" /> : null}
        <Content>
          {data.kicker ? <Kicker>{data.kicker}</Kicker> : null}
          <Title>{data.title}</Title>
          {data.subtitle ? <Subtitle>{data.subtitle}</Subtitle> : null}
          {data.description ? <Description>{data.description}</Description> : null}
          <StatsGrid groups={data.stats} />
          {data.related.map((group) => (
            <RelatedSection key={`${group.category}-${group.title}`} group={group} />
          ))}
        </Content>
      </ScrollView>
    </Screen>
  );
}
