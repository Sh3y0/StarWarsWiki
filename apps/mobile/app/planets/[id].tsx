import { useLocalSearchParams } from 'expo-router';
import { CategoryDetailScreen } from '@/components/category/CategoryDetailScreen';

export default function PlanetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <CategoryDetailScreen category="planets" id={id} />;
}
