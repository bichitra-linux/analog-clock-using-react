import { render, screen } from '@testing-library/react';
import App from './App';

const mockPosition = {
  coords: {
    latitude: 37.7749,
    longitude: -122.4194,
    accuracy: 15,
  },
  timestamp: Date.now(),
};

beforeAll(() => {
  const geolocation = {
    watchPosition: jest.fn((success) => {
      success(mockPosition);
      return 1;
    }),
    clearWatch: jest.fn(),
  };

  Object.defineProperty(global.navigator, 'geolocation', {
    value: geolocation,
    configurable: true,
  });
});

test('renders clock dashboard with date and location sections', async () => {
  render(<App />);

  expect(await screen.findByRole('button', { name: /change timezone/i })).toBeInTheDocument();
  expect(await screen.findByLabelText(/device time/i)).toBeInTheDocument();
  expect(await screen.findByRole('heading', { name: /today/i })).toBeInTheDocument();
  expect(await screen.findByRole('heading', { name: /your location/i })).toBeInTheDocument();
  expect(screen.getByRole('status')).toBeInTheDocument();
});
