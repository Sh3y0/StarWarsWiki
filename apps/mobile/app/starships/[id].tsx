import { useLocalSearchParams } from 'expo-router';
import { CategoryDetailScreen } from '@/components/category/CategoryDetailScreen';

export default function StarshipDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <CategoryDetailScreen category="starships" id={id} />;
}
