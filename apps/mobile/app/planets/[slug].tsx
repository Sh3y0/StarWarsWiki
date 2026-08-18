import { useLocalSearchParams } from 'expo-router';
import { PlaceholderScreen } from '@/components/ui/PlaceholderScreen';

export default function PlanetDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  return <PlaceholderScreen title="Planet detail" subtitle={slug} />;
}
