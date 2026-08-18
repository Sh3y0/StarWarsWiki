import { useLocalSearchParams } from 'expo-router';
import { CategoryDetailScreen } from '@/components/category/CategoryDetailScreen';

export default function CharacterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <CategoryDetailScreen category="characters" id={id} />;
}
