import { Image } from 'expo-image';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';

const CardContainer = styled.View`
  width: 48%;
  margin-bottom: 16px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  overflow: hidden;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

const CardImage = styled(Image)`
  width: 100%;
  aspect-ratio: 1;
  background-color: ${({ theme }) => theme.colors.surfaceAlt};
`;

const CardTitle = styled.Text`
  padding: 10px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.size.sm}px;
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`;

export interface CardProps {
  title: string;
  imageUrl?: string;
  onPress?: () => void;
}

export function Card({ title, imageUrl, onPress }: CardProps) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={title}>
      <CardContainer>
        {imageUrl ? <CardImage source={{ uri: imageUrl }} contentFit="cover" /> : null}
        <CardTitle numberOfLines={1}>{title}</CardTitle>
      </CardContainer>
    </Pressable>
  );
}
