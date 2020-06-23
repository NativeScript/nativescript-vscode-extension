import { LAYOUT_HOVER_PROVIDERS } from './layout-hover';
import { UI_ENUM_PROVIDERS } from './ui-enum-hover';
import { WIDGET_HOVER_PROVIDERS } from './widget-hover';

export const HOVER_PROVIDERS = LAYOUT_HOVER_PROVIDERS.concat(WIDGET_HOVER_PROVIDERS, UI_ENUM_PROVIDERS);
