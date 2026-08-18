import { ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import styled, { useTheme } from 'styled-components/native';
import { useCatalogDetail } from '../../hooks/useCatalogDetail';
import { crawlParagraphs } from '../../utils/format';
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

const HeroWrap = styled.View`
  width: 100%;
`;

const Hero = styled(Image)`
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: ${({ theme }) => theme.colors.surfaceAlt};
`;

const Content = styled.View`
  padding: 00px 16px 40px 16px;
  margin-top: -40px;
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

const Crawl = styled.View`
  margin-top: 24px;
  padding: 8px 4px 4px 4px;
`;

const CrawlParagraph = styled.Text`
  margin-bottom: 22px;
  color: ${({ theme }) => theme.colors.accentGold};
  font-size: ${({ theme }) => theme.typography.size.md}px;
  font-style: italic;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  text-align: center;
  line-height: 26px;
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
        {data.imageUrl ? (
          <HeroWrap>
            <Hero source={{ uri: data.imageUrl }} contentFit="cover" />
            <LinearGradient
              colors={['transparent', theme.colors.background]}
              locations={[0, 1]}
              style={styles.fade}
              pointerEvents="none"
            />
          </HeroWrap>
        ) : null}
        <Content>
          {data.kicker ? <Kicker>{data.kicker}</Kicker> : null}
          <Title>{data.title}</Title>
          {data.subtitle ? <Subtitle>{data.subtitle}</Subtitle> : null}
          {data.description ? (
            category === 'films' ? (
              <Crawl>
                {crawlParagraphs(data.description).map((paragraph, index) => (
                  <CrawlParagraph key={index}>{paragraph}</CrawlParagraph>
                ))}
              </Crawl>
            ) : (
              <Description>{data.description}</Description>
            )
          ) : null}
          <StatsGrid groups={data.stats} />
          {data.related.map((group) => (
            <RelatedSection key={`${group.category}-${group.title}`} group={group} />
          ))}
        </Content>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
});
