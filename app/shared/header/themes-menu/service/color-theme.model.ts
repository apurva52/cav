
export interface Theme {
  id: string;
  label: string;
  /**
   * 4 Color Hex in Array form
   */
  colors: Array<string>;
  monochromaticColors?: Array<MonochromaticColorSet>;
}

export interface MonochromaticColorSet {
  colors?: Array<string>;
  name?: string;
}

export interface ConfigurationMenu {
 options: Array<ConfigurationOptions>
}

export interface ConfigurationOptions{
  label?: string;
  items?: Array<ConfigurationOptions>;
  separator?: boolean;
  icon?: string;
  routerLink?: any;
  colors?: Array<string>;
}
