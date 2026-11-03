// The About page. The bio itself is in `src/portfolio.config.ts`.

export type Service = { title: string; body: string };
export type Role = { years: string; title: string; place: string; note?: string };

export const about: {
  heading: string;
  services: Service[];
  experience: Role[];
  clients: string[];
} = {
  heading: 'I design the first version, then I build it *well enough to argue with*.',
  services: [
    {
      title: 'Product design for first versions',
      body: 'From a messy brief to a product people can use: research, flows, interface, and the decisions written down so they survive the handoff.'
    },
    {
      title: 'Prototypes in real code',
      body: 'React prototypes that behave like the product, with real data and real edge cases, so engineers and stakeholders react to the thing itself.'
    },
    {
      title: 'Replacing the spreadsheet',
      body: 'Internal tools for teams who run on a shared sheet: scheduling, intake, operations. I map how the sheet is really used before touching it.'
    },
    {
      title: 'Accessibility and older adults',
      body: 'Research and design reviews for products used by people over 70, people with low vision, and people who didn’t choose to be your user.'
    }
  ],
  experience: [
    { years: '2023 – now', title: 'Independent product designer', place: 'Brooklyn' },
    { years: '2020 – 23', title: 'Design lead', place: 'Fieldnote Health' },
    { years: '2017 – 20', title: 'Product designer, scheduling', place: 'Marquee' },
    { years: '2016', title: 'Design intern', place: 'Ashby State University Libraries' },
    { years: '2013 – 17', title: 'BFA, Communication Design', place: 'Ashby State University' }
  ],
  clients: [
    'Openhand',
    'Fernwood Community School of the Arts',
    'Northside Elder Care Network',
    'Kittiwake',
    'Studio Hours',
    'Halyard Credit Union',
    'Tandem Public Libraries',
    'Pocket Orchard',
    'Fieldnote Health',
    'Common Table Food Co-op'
  ]
};
