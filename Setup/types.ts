export enum Position {
  Skip = 'Skip',
  Vice = 'Vice',
  Second = 'Second',
  Lead = 'Lead'
}

export interface PlayerPreference {
  id: string;
  firstName: string;
  lastName: string;
  position: Position;
}

export interface Team {
  sheet: number,
  [Position.Skip]: PlayerPreference,
  [Position.Vice]?: PlayerPreference,
  [Position.Second]?: PlayerPreference,
  [Position.Lead]?: PlayerPreference
}

export const mockData = [
  {
    id: '1',
    firstName: 'Amy',
    lastName: 'B',
    position: undefined
  },
  {
    id: '2',
    firstName: 'Andrea',
    lastName: 'L',
    position: undefined
  },
  {
    id: '3',
    firstName: 'Andrew',
    lastName: 'R',
    position: undefined
  },
  {
    id: '4',
    firstName: 'Andy',
    lastName: 'I',
    position: undefined
  },
  {
    id: '5',
    firstName: 'Anthony',
    lastName: 'V',
    position: undefined
  },
  {
    id: '6',
    firstName: 'Ariel',
    lastName: 'N',
    position: undefined
  },
  {
    id: '7',
    firstName: 'Caitlyn',
    lastName: 'F',
    position: undefined
  },
  {
    id: '8',
    firstName: 'Caroline',
    lastName: 'S',
    position: undefined
  },
  {
    id: '9',
    firstName: 'Chethan',
    lastName: 'S',
    position: undefined
  },
  {
    id: '10',
    firstName: 'Dave',
    lastName: 'F',
    position: undefined
  },
  {
    id: '11',
    firstName: 'Edward',
    lastName: 'H',
    position: undefined
  },
  {
    id: '12',
    firstName: 'Geoff',
    lastName: 'R',
    position: undefined
  },
  {
    id: '13',
    firstName: 'Greg',
    lastName: 'R',
    position: undefined
  },
  {
    id: '14',
    firstName: 'Jacob',
    lastName: 'F',
    position: undefined
  },
  {
    id: '15',
    firstName: 'James',
    lastName: 'T',
    position: undefined
  },
  {
    id: '16',
    firstName: 'Jill',
    lastName: 'B',
    position: undefined
  },
  {
    id: '17',
    firstName: 'Joel',
    lastName: 'P',
    position: undefined
  },
  {
    id: '18',
    firstName: 'John',
    lastName: 'C',
    position: undefined
  },
  {
    id: '19',
    firstName: 'John',
    lastName: 'C',
    position: undefined
  },
  {
    id: '20',
    firstName: 'Joseph',
    lastName: 'F',
    position: undefined
  },
  {
    id: '21',
    firstName: 'Kenneth',
    lastName: 'N',
    position: undefined
  },
  {
    id: '22',
    firstName: 'Laura',
    lastName: 'L',
    position: undefined
  },
  {
    id: '23',
    firstName: 'Leah',
    lastName: 'B',
    position: undefined
  },
  {
    id: '24',
    firstName: 'Leslie',
    lastName: 'M',
    position: undefined
  },
  {
    id: '25',
    firstName: 'Matt ',
    lastName: 'C',
    position: undefined
  },
  {
    id: '26',
    firstName: 'Matthew',
    lastName: 'A',
    position: undefined
  },
  {
    id: '27',
    firstName: 'Michael',
    lastName: 'C',
    position: undefined
  },
  {
    id: '28',
    firstName: 'Nicholas',
    lastName: 'S',
    position: undefined
  },
  {
    id: '29',
    firstName: 'Nimmi',
    lastName: 'C',
    position: undefined
  },
  {
    id: '30',
    firstName: 'Pat',
    lastName: 'O',
    position: undefined
  },
  {
    id: '31',
    firstName: 'Paul',
    lastName: 'Aronofsky',
    position: undefined
  },
  {
    id: '32',
    firstName: 'Ryan',
    lastName: 'Buenuceso',
    position: undefined
  },
  {
    id: '33',
    firstName: 'Scott',
    lastName: 'Cleave',
    position: undefined
  },
  {
    id: '34',
    firstName: 'Stephen',
    lastName: 'Marquis',
    position: undefined
  },
  {
    id: '35',
    firstName: 'Therese',
    lastName: 'Mulvey',
    position: undefined
  },
  {
    id: '36',
    firstName: 'Thomas',
    lastName: 'Westerling',
    position: undefined
  },
  {
    id: '37',
    firstName: 'Tom',
    lastName: 'Bucklaew',
    position: undefined
  },
  {
    id: '38',
    firstName: 'Tracy',
    lastName: 'Paskiewicz',
    position: undefined
  },
  {
    id: '39',
    firstName: 'Jon',
    lastName: 'Hearn',
    position: undefined
  },
  {
    id: '40',
    firstName: 'Chris',
    lastName: 'Morrissey',
    position: undefined
  },
];