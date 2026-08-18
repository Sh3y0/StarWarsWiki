import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import styled from 'styled-components/native';
import { ActivityIndicator } from 'react-native';
import { useCategoryList } from '@/hooks/useCategoryList';
import { SearchBar } from '@/components/ui/SearchBar';
import { CategoryGrid } from '@/components/category/CategoryGrid';
import { PlaceholderScreen } from '@/components/ui/PlaceholderScreen';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const SearchBarWrapper = styled.View`
  padding: 16px 16px 0 16px;
`;

const CenteredContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export default function CharactersScreen() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useMemo(() => search.trim(), [search]);
  const { data, isLoading, isError, error } = useCategoryList('characters', {
    search: debouncedSearch || undefined,
  });

  return (
    <Container>
      <SearchBarWrapper>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search characters..." />
      </SearchBarWrapper>

      {isLoading ? (
        <CenteredContainer>
          <ActivityIndicator size="large" />
        </CenteredContainer>
      ) : isError ? (
        <PlaceholderScreen
          title="Something went wrong"
          subtitle={error instanceof Error ? error.message : 'Failed to load characters'}
        />
      ) : (
        <CategoryGrid
          items={data ?? []}
          onItemPress={(item) => router.push(`/characters/${item.slug}`)}
        />
      )}
    </Container>
  );
}
