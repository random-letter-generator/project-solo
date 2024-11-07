module.exports = {
  content: ['./client/**/*.{js,jsx,ts,tsx}', './client/html/**/*.html'],
  theme: {
    extend: {
      gridTemplateColumns: {
        15: 'repeat(15, minmax(0, 1fr))',
      },
      gridTemplateRows: {
        15: 'repeat(15, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
};
