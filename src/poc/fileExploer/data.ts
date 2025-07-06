export const TREEE_DATA = {
  id: 1,
  name: 'Project Root',
  children: [
    {
      id: 2,
      name: 'src',
      files: ['index.js'],
      children: [
        {
          id: 3,
          name: 'components',
          files: ['Header.js'],
          children: [
            {
              id: 4,
              name: 'common',
              files: ['Button.js'],
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: 5,
      name: 'assets',
      files: ['logo.png'],
      children: [],
    },
    {
      id: 6,
      name: 'docs',
      files: ['README.md'],
      children: [],
    },
  ],
};
