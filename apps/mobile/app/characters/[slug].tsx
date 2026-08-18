import { ActivityIndicator, ScrollView } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import styled from 'styled-components/native';
import { useCategoryDetail } from '@/hooks/useCategoryDetail';
import { PlaceholderScreen } from '@/components/ui/PlaceholderScreen';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const CenteredContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const HeroImage = styled(Image)`
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: ${({ theme }) => theme.colors.surfaceAlt};
`;

const Content = styled.View`
  padding: 20px;
`;

const Title = styled.Text`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.size.xl}px;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`;

const Description = styled.Text`
  margin-top: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.size.md}px;
  line-height: 22px;
`;

export default function CharacterDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data, isLoading, isError } = useCategoryDetail('characters', slug);

  if (isLoading) {
    return (
      <CenteredContainer>
        <ActivityIndicator size="large" />
      </CenteredContainer>
    );
  }

  if (isError || !data) {
    return <PlaceholderScreen title="Not found" subtitle={`No character matches "${slug}"`} />;
  }

  return (
    <Container>
      <Stack.Screen options={{ title: data.title }} />
      <ScrollView>
        {data.images?.desktop?.desktop_16x9 ? (
          <HeroImage source={{ uri: data.images.desktop.desktop_16x9 }} contentFit="cover" />
        ) : null}
        <Content>
          <Title>{data.title}</Title>
          {data.description ? <Description>{data.description}</Description> : null}
        </Content>
      </ScrollView>
    </Container>
  );
}
