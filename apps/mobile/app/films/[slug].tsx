import { useLocalSearchParams } from 'expo-router';
import { PlaceholderScreen } from '@/components/ui/PlaceholderScreen';

export default function FilmDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  return <PlaceholderScreen title="Film detail" subtitle={slug} />;
}
