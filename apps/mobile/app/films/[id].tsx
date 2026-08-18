import { useLocalSearchParams } from 'expo-router';
import { CategoryDetailScreen } from '@/components/category/CategoryDetailScreen';

export default function FilmDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <CategoryDetailScreen category="films" id={id} />;
}
