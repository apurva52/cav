export interface UserMenuOption {
  label: string;
  routerLink?: any;
  items?: Array<UserMenuOption>;
}
