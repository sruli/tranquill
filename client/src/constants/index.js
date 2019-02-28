const { prodEnv } = require('../utils/envUtils');

export const API_URL = prodEnv() ? 'https://api.tranquillapp.com' : 'http://localhost:8080';
export const RESET = 'RESET';
