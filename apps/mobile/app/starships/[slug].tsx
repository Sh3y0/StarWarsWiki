import { useLocalSearchParams } from 'expo-router';
import { PlaceholderScreen } from '@/components/ui/PlaceholderScreen';

export default function StarshipDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  return <PlaceholderScreen title="Starship detail" subtitle={slug} />;
}
