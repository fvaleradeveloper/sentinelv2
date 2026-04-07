import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 200,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://tu-app.vercel.app';

export default function () {
  // Test página principal
  const resHome = http.get(`${BASE_URL}/`);
  check(resHome, {
    'hub status 200': (r) => r.status === 200,
    'hub response < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);

  // Test API health
  const resApi = http.get(`${BASE_URL}/api/auth/callback`);
  check(resApi, {
    'api responde': (r) => r.status < 500,
  });

  sleep(1);
}