export enum NewsType {
  'All',
  'Business',
  'Entertainment',
  'General',
  'Health',
  'Science',
  'Sports',
  'Technology',
}

export type NewCardTypoe = {
  imageUrls: string;
  title: string;
  description: string;
  newType: NewsType;
};
