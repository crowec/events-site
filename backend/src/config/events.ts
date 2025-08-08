import bcrypt from 'bcrypt';

export interface EventConfig {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  theme: 'dark' | 'gold' | 'red' | 'blue';
  passwordHash: string;
  capacity?: number | undefined;
  dress_code?: string | undefined;
  details?: string | undefined;
}

const SALT_ROUNDS = 12;

const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const createEventConfig = async (
  id: string,
  title: string,
  description: string,
  date: string,
  time: string,
  location: string,
  theme: 'dark' | 'gold' | 'red' | 'blue',
  password: string,
  capacity?: number,
  dress_code?: string,
  details?: string
): Promise<EventConfig> => {
  return {
    id,
    title,
    description,
    date,
    time,
    location,
    theme,
    passwordHash: await hashPassword(password),
    capacity,
    dress_code,
    details
  };
};

export const initializeEvents = async (): Promise<EventConfig[]> => {
  return Promise.all([
    createEventConfig(
      'midnight-gala',
      'Midnight Gala',
      'An exclusive evening of mystery and elegance',
      '2024-09-15',
      '23:00',
      'The Obsidian Ballroom',
      'dark',
      'shadows',
      50,
      'Black tie required',
      'Join us for an unforgettable night where shadows dance with light. Limited to 50 distinguished guests.'
    ),
    createEventConfig(
      'golden-circle',
      'The Golden Circle',
      'Where legends are born and fortunes made',
      '2024-10-01',
      '20:00',
      'Private Residence',
      'gold',
      'midas',
      25,
      'Cocktail attire in gold tones',
      'An intimate gathering for the elite. Network with industry titans and visionaries.'
    ),
    createEventConfig(
      'crimson-society',
      'Crimson Society',
      'Passion, power, and prestige collide',
      '2024-10-20',
      '21:30',
      'The Ruby Chamber',
      'red',
      'phoenix',
      75,
      'Formal wear with red accents',
      'A night of intensity and sophistication. Experience luxury beyond imagination.'
    ),
    createEventConfig(
      'sapphire-summit',
      'Sapphire Summit',
      'Where innovation meets tradition',
      '2024-11-10',
      '19:00',
      'Crystal Tower Penthouse',
      'blue',
      'azure',
      100,
      'Business formal',
      'The pinnacle of exclusive networking. Connect with tomorrow\'s leaders today.'
    )
  ]);
};