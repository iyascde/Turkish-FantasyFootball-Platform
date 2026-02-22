import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export const getStandings = () => axios.get(`${BASE_URL}/football/standings`);
export const getFixtures = () => axios.get(`${BASE_URL}/football/fixtures`);
export const getTopScorers = () => axios.get(`${BASE_URL}/football/topscorers`);
export const getLeagues = () => axios.get(`${BASE_URL}/leagues`);
export const createLeague = (data, token) => axios.post(`${BASE_URL}/leagues/create`, data, { headers: { authorization: token } });
export const joinLeague = (id, token) => axios.post(`${BASE_URL}/leagues/join/${id}`, {}, { headers: { authorization: token } });