import { ActivityIndicator, FlatList, Pressable } from 'react-native';
import { router } from 'expo-router';
import styled, { useTheme } from 'styled-components/native';
import { useState } from 'react';
import { CATEGORY_ROUTE, CATEGORY_UI } from '../../constants/categories';
import { useCatalogList } from '../../hooks/useCatalogList';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { SearchBar } from '../ui/SearchBar';
import { PlaceholderScreen } from '../ui/PlaceholderScreen';
import { CatalogCard } from './CatalogCard';
import { CategoryHero } from './CategoryHero';
import type { CatalogCategory, CatalogListItem } from '../../types/catalog';

const SCREEN_GUTTER = 16;
const GRID_GAP = 12;

const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const SearchWrap = styled.View`
  padding: 12px ${SCREEN_GUTTER}px ${GRID_GAP}px ${SCREEN_GUTTER}px;
`;

const Centered = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 32px ${SCREEN_GUTTER}px;
`;

const GridItem = styled.View`
  flex: 1;
`;

const WideItem = styled.View`
  padding: 0 ${SCREEN_GUTTER}px ${GRID_GAP}px ${SCREEN_GUTTER}px;
`;

const LoadMore = styled.Text`
  text-align: center;
  padding: 16px;
  color: ${({ theme }) => theme.colors.textPrimary};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  margin: 4px ${SCREEN_GUTTER}px 24px ${SCREEN_GUTTER}px;
  letter-spacing: 1px;
`;

export interface CategoryListScreenProps {
  category: CatalogCategory;
}

export function CategoryListScreen({ category }: CategoryListScreenProps) {
  const theme = useTheme();
  const ui = CATEGORY_UI[category];
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search.trim());
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useCatalogList(category, { search: debouncedSearch || undefined });

  const items = data?.pages.flatMap((page) => page.items) ?? [];
  const numColumns = ui.layout === 'wide' ? 1 : 2;

  function renderItem({ item }: { item: CatalogListItem }) {
    const ItemWrap = ui.layout === 'wide' ? WideItem : GridItem;
    return (
      <ItemWrap>
        <CatalogCard
          item={item}
          imageAspect={ui.imageAspect}
          wide={ui.layout === 'wide'}
          onPress={() => router.push(`${CATEGORY_ROUTE[category]}/${item.id}`)}
        />
      </ItemWrap>
    );
  }

  return (
    <Screen>
      {isError ? (
        <>
          <CategoryHero title={ui.heroTitle} kicker={ui.kicker} />
          <PlaceholderScreen
            title="Something went wrong"
            subtitle={
              error instanceof Error ? error.message : `Failed to load ${ui.tabLabel.toLowerCase()}`
            }
          />
        </>
      ) : (
        <FlatList
          key={numColumns}
          data={items}
          numColumns={numColumns}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          removeClippedSubviews={false}
          columnWrapperStyle={
            numColumns > 1
              ? { paddingHorizontal: SCREEN_GUTTER, marginBottom: GRID_GAP, gap: GRID_GAP }
              : undefined
          }
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              void fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.4}
          ListHeaderComponent={
            <>
              <CategoryHero title={ui.heroTitle} kicker={ui.kicker} />
              <SearchWrap>
                <SearchBar
                  value={search}
                  onChangeText={setSearch}
                  placeholder={ui.searchPlaceholder}
                />
              </SearchWrap>
              {isLoading ? (
                <Centered>
                  <ActivityIndicator size="large" color={theme.colors.accentCyan} />
                </Centered>
              ) : null}
            </>
          }
          ListEmptyComponent={
            isLoading ? null : (
              <PlaceholderScreen title="No results" subtitle="Try a different search." />
            )
          }
          ListFooterComponent={
            hasNextPage ? (
              <Pressable onPress={() => void fetchNextPage()} accessibilityRole="button">
                {isFetchingNextPage ? (
                  <Centered>
                    <ActivityIndicator color={theme.colors.accentCyan} />
                  </Centered>
                ) : (
                  <LoadMore>... LOAD MORE</LoadMore>
                )}
              </Pressable>
            ) : null
          }
        />
      )}
    </Screen>
  );
}
