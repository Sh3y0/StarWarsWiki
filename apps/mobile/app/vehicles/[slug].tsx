import { useLocalSearchParams } from 'expo-router';
import { PlaceholderScreen } from '@/components/ui/PlaceholderScreen';

export default function VehicleDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  return <PlaceholderScreen title="Vehicle detail" subtitle={slug} />;
}
