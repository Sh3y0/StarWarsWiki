import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import type { CatalogListItem } from '../../types/catalog';

const CardContainer = styled.View`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  overflow: hidden;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

const ImageWrap = styled.View`
  width: 100%;
`;

const Body = styled.View`
  padding: 10px 12px 12px 12px;
`;

const Subtitle = styled.Text`
  color: ${({ theme }) => theme.colors.accentCyan};
  font-size: ${({ theme }) => theme.typography.size.xs}px;
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  letter-spacing: 0.6px;
  text-transform: uppercase;
`;

const Title = styled.Text`
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.size.sm}px;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  text-transform: uppercase;
`;

const Caption = styled.Text`
  margin-top: 2px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.size.xs}px;
`;

const MetaRow = styled.View`
  margin-top: 8px;
  flex-direction: row;
  justify-content: space-between;
  gap: 8px;
`;

const MetaLabel = styled.Text`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.size.xs}px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const MetaValue = styled.Text`
  flex-shrink: 1;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.size.xs}px;
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  text-align: right;
`;

export interface CatalogCardProps {
  item: CatalogListItem;
  imageAspect: number;
  wide?: boolean;
  onPress?: () => void;
}

export function CatalogCard({ item, imageAspect, wide, onPress }: CatalogCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={item.title}
      style={styles.pressable}
    >
      <CardContainer>
        <ImageWrap>
          <Image
            source={item.imageUrl ? { uri: item.imageUrl } : undefined}
            contentFit="cover"
            style={[
              styles.image,
              { aspectRatio: imageAspect, backgroundColor: theme.colors.surfaceAlt },
            ]}
          />
          <LinearGradient
            colors={['transparent', theme.colors.surface]}
            locations={[0, 1]}
            style={styles.fade}
            pointerEvents="none"
          />
        </ImageWrap>
        <Body>
          {item.subtitle ? <Subtitle numberOfLines={1}>{item.subtitle}</Subtitle> : null}
          <Title numberOfLines={wide ? 2 : 1}>{item.title}</Title>
          {item.caption ? <Caption>{item.caption}</Caption> : null}
          {item.meta?.map((meta) => (
            <MetaRow key={meta.label}>
              <MetaLabel>{meta.label}</MetaLabel>
              <MetaValue numberOfLines={1}>{meta.value}</MetaValue>
            </MetaRow>
          ))}
        </Body>
      </CardContainer>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
  },
  image: {
    width: '100%',
  },
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
});
