import bcrypt from 'bcrypt';

export interface EventConfig {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    theme: string;
    passwordHash: string;
    description?: string | undefined;
}

const SALT_ROUNDS = 12;

const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};

export const createEventConfig = async (
    id: string,
    title: string,
    date: string,
    time: string,
    location: string,
    theme: string,
    password: string,
    description?: string
): Promise<EventConfig> => {
    return {
        id,
        title,
        date,
        time,
        location,
        theme,
        passwordHash: await hashPassword(password),
        description,
    };
};

export const initializeEvents = async (): Promise<EventConfig[]> => {
    return Promise.all([
        createEventConfig(
            'midnight-gala',
            'Midnight Gala',
            '2024-09-15',
            '23:00',
            'The Obsidian Ballroom',
            'theme',
            'shadows',
            "Join us for an unforgettable night where shadows dance with light. An evening of timeless elegance in the city's most exclusive ballroom."
        ),
        createEventConfig(
            'golden-circle',
            'The Golden Circle',
            '2024-10-01',
            '20:00',
            'Private Residence',
            'theme',
            'midas',
            'An intimate gathering for the elite. Network with industry titans and visionaries in an atmosphere of refined luxury and golden splendor.'
        ),
        createEventConfig(
            'crimson-society',
            'Crimson Society',
            '2024-10-20',
            '21:30',
            'The Ruby Chamber',
            'theme',
            'phoenix',
            "A night of intensity and sophistication. Experience luxury beyond imagination where passion meets power in the city's most prestigious venue."
        ),
        createEventConfig(
            'sapphire-summit',
            'Sapphire Summit',
            '2024-11-10',
            '19:00',
            'Crystal Tower Penthouse',
            'theme',
            'azure',
            "The pinnacle of exclusive networking. Connect with tomorrow's leaders today in a space where cutting-edge innovation meets timeless tradition."
        ),
        createEventConfig(
            'connie-30',
            'Connie-con',
            '2025-10-04',
            '15:30 - 23:00',
            'SOMEWHERE',
            'birthday',
            'ohshitsheold',
            "The pinnacle of exclusive networking. Connect with tomorrow's leaders today in a space where cutting-edge innovation meets timeless tradition."
        ),
    ]);
};
