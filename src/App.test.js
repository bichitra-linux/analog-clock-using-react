import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    getCurrentPosition: jest.fn((success) => {
      success(mockPosition);
    }),
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

test('renders clock dashboard with device time and satellite fix', async () => {
  render(<App />);

  expect(await screen.findByRole('button', { name: /change timezone/i })).toBeInTheDocument();
  expect(await screen.findByLabelText(/device time/i)).toBeInTheDocument();
  expect(await screen.findByText(/chrono watch/i)).toBeInTheDocument();
  expect(await screen.findByLabelText(/satellite fix/i)).toBeInTheDocument();
});

test('opens the timezone picker from the search pill', async () => {
  render(<App />);

  await screen.findByRole('button', { name: /change timezone/i });
  await userEvent.click(screen.getByRole('button', { name: /search timezones/i }));

  expect(await screen.findByRole('dialog', { name: /select timezone/i })).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/search for a city/i)).toBeInTheDocument();
});

test('navigates to the alarms tab', async () => {
  render(<App />);

  await screen.findByRole('button', { name: /change timezone/i });
  await userEvent.click(screen.getByRole('button', { name: /alarms/i }));

  expect(await screen.findByText('No alarms')).toBeInTheDocument();
});
