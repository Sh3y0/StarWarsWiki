import 'styled-components/native';
import type { AppTheme } from './index';

declare module 'styled-components/native' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends AppTheme {}
}
