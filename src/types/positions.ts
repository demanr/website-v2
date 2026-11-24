export interface Position {
  company: string;
  title: string;
  startDate: Date;
  description: string;
}

export const positions: Position[] = [
  { company: 'Google', title: 'Software Engineer', startDate: new Date(2026, 7, 1), description: 'lore ipsum dolor sit amet' },
  { company: 'Google', title: 'Software Engineering Intern', startDate: new Date(2025, 4, 1), description: 'lore ipsum dolor sit amet' },
  { company: 'Vidyard', title: 'Software Developer Co-op', startDate: new Date(2024, 8, 1), description: 'lore ipsum dolor sit amet' },
  { company: 'Okta', title: 'Software Engineer Intern', startDate: new Date(2024, 4, 1), description: 'lore ipsum dolor sit amet' },
  { company: '1Password', title: 'Developer Co-op', startDate: new Date(2023, 4, 1), description: 'lore ipsum dolor sit amet' },
];
