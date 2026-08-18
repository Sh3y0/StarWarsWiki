import { useLocalSearchParams } from 'expo-router';
import { CategoryDetailScreen } from '@/components/category/CategoryDetailScreen';

export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <CategoryDetailScreen category="vehicles" id={id} />;
}
