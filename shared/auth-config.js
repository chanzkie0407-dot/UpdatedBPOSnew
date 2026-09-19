export let VALID_USERS = [
  { id: 1, name: 'Admin', role: 'admin', password: '8888', storeId: 'ALL' },
  { id: 2, name: 'Service Provider', role: 'service_provider', password: '19970407chan', storeId: 'ALL' }
];

// Sync with localStorage if updated
const storedUsers = localStorage.getItem('VALID_USERS');
if (storedUsers) {
  VALID_USERS = JSON.parse(storedUsers);
}
