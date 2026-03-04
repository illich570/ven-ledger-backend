export interface User {
  id: string;
  email: string;
  name: string;
  image?: string | null | undefined;
  logoKeyName?: string | null | undefined;
}
