import bcrypt from 'bcrypt';

export interface EventConfig {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  passwordHash: string;
  backgroundImage?: string | undefined;
  fontFamily?: string | undefined;
  backgroundColor?: string | undefined;
  containerBackgroundColor?: string | undefined;
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
  password: string,
  backgroundImage?: string,
  fontFamily?: string,
  backgroundColor?: string,
  containerBackgroundColor?: string,
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
    passwordHash: await hashPassword(password),
    backgroundImage,
    fontFamily,
    backgroundColor,
    containerBackgroundColor,
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
      'shadows',
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=1920&h=1080&fit=crop&crop=center',
      '"Playfair Display", serif',
      'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
      'rgba(0, 0, 0, 0.4)',
      'Black tie required',
      'Join us for an unforgettable night where shadows dance with light. An evening of timeless elegance in the city\'s most exclusive ballroom.'
    ),
    createEventConfig(
      'golden-circle',
      'The Golden Circle',
      'Where legends are born and fortunes made',
      '2024-10-01',
      '20:00',
      'Private Residence',
      'midas',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop&crop=center',
      '"Cormorant Garamond", serif',
      'linear-gradient(135deg, #1a1611 0%, #2d2417 50%, #3d3020 100%)',
      'rgba(212, 175, 55, 0.3)',
      'Cocktail attire in gold tones',
      'An intimate gathering for the elite. Network with industry titans and visionaries in an atmosphere of refined luxury and golden splendor.'
    ),
    createEventConfig(
      'crimson-society',
      'Crimson Society',
      'Passion, power, and prestige collide',
      '2024-10-20',
      '21:30',
      'The Ruby Chamber',
      'phoenix',
      'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1920&h=1080&fit=crop&crop=center',
      '"Cinzel", serif',
      'linear-gradient(135deg, #1a0a0a 0%, #2d1515 50%, #3d2020 100%)',
      'rgba(212, 55, 55, 0.3)',
      'Formal wear with red accents',
      'A night of intensity and sophistication. Experience luxury beyond imagination where passion meets power in the city\'s most prestigious venue.'
    ),
    createEventConfig(
      'sapphire-summit',
      'Sapphire Summit',
      'Where innovation meets tradition',
      '2024-11-10',
      '19:00',
      'Crystal Tower Penthouse',
      'azure',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop&crop=center',
      '"Montserrat", sans-serif',
      'linear-gradient(135deg, #0a0f1a 0%, #152030 50%, #1f2a3a 100%)',
      'rgba(55, 118, 212, 0.3)',
      'Business formal',
      'The pinnacle of exclusive networking. Connect with tomorrow\'s leaders today in a space where cutting-edge innovation meets timeless tradition.'
    )
  ]);
};