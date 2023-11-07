import axios from "axios";

// const baseURL: string = 'http://localhost:8080/api';
const baseURL: string = 'https://dtauecfjkd.us-east-1.awsapprunner.com/api';

class ApiService {

    private baseUrl: string;

    constructor() {
        this.baseUrl = baseURL;
    }

    async signUp(firstName: string, lastName: string, email: string, password: string) {
        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('email', email);
        formData.append('password', password);
        const headersObj = {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        return axios.post(this.baseUrl + '/signUp', formData, headersObj)
            .then(res => res.data);
    }

    async signIn(email: string, password: string, rememberMe: boolean) {    
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('rememberMe', rememberMe ? 'true' : 'false');
        const headersObj = {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        return axios.post(this.baseUrl + '/signIn', formData, headersObj)
            .then(res => res.data);
    }

    async getTournaments() {
        return axios.get(this.baseUrl + '/tournaments').then(res => res.data);
    }

    async getExposureData(accessToken: string) {
        const headersObj = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
            }
        }
        return axios.get(this.baseUrl + '/exposure', headersObj)
           .then(res => res.data);
    }

    async uploadExposure(accessToken: string, csvFile: File, exposureType: string) {
        const formData = new FormData();
        formData.append('file', csvFile);
        formData.append('exposureType', exposureType);
        const headersObj = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + accessToken,
            }
        }
        return axios.post(this.baseUrl + '/upload', formData, headersObj)
            .then(res => res.data);
    }

    async deleteExposure(accessToken: string, exposureType: string) {
        const formData = new FormData();
        formData.append('exposureType', exposureType);
        const headersObj = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
            }
        }
        return axios.post(this.baseUrl + '/deleteExposure', formData, headersObj)
            .then(res => res.data);
    }

    async uploadAdps(accessToken: string, csvFile: File, exposureType: string) {
        const formData = new FormData();
        formData.append('file', csvFile);
        formData.append('exposureType', exposureType);
        const headersObj = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + accessToken,
            }
        }
        return axios.post(this.baseUrl + '/admin/upload/adp', formData, headersObj)
            .then(res => res.data);
    }

    async getAdps(accessToken: string) {
        return axios.get(this.baseUrl + '/adp', { headers: { 'Authorization': 'Bearer ' + accessToken } })
            .then(res => res.data);
    }

    async checkToken(token: string, refresh) {
        const formData = new FormData();
        formData.append('token', token);
        formData.append('refresh', refresh ? 'true' : 'false');
        const headersObj = {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        return axios.post(this.baseUrl + '/token', formData, headersObj)
            .then(res => res.data);
    }

    async deleteRefreshToken(refreshToken: string) {
        const formData = new FormData();
        formData.append('token', refreshToken);
        const headersObj = {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        return axios.post(this.baseUrl + '/deleteToken', formData, headersObj)
            .then(res => res.data);
    }

    async addReplacementRule(token: string, fName: string, lName: string, fNameReplacement: string, lNameReplacement: string) {
        const formData = new FormData();
        formData.append('fName', fName);
        formData.append('lName', lName);
        formData.append('fNameReplacement', fNameReplacement);
        formData.append('lNameReplacement', lNameReplacement);
        const headersObj = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        }
        return axios.post(this.baseUrl + '/admin/addReplacementRule', formData, headersObj)
            .then(res => res.data);
    }

    async deleteReplacementRule(token: string, id: string) {
        const formData = new FormData();
        formData.append('id', id);
        const headersObj = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        }
        return axios.post(this.baseUrl + '/admin/deleteReplacementRule', formData, headersObj)
            .then(res => res.data);
    }

    async getReplacementRules(token: string) {
        return axios.get(this.baseUrl + '/admin/replacementRules', { headers: { 'Authorization': 'Bearer ' + token } })
            .then(res => res.data);
    }

    async addRookieDefinition(token: string, firstName: string, lastName: string, team: string, position: string, season: number) {
        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('team', team);
        formData.append('position', position);
        formData.append('season', season.toString());
        const headersObj = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        }
        return axios.post(this.baseUrl + '/admin/addRookieDefinition', formData, headersObj)
            .then(res => res.data);
    }
    
    async deleteRookieDefinition(token: string, id: string) {
        const formData = new FormData();
        formData.append('id', id);
        const headersObj = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        }
        return axios.post(this.baseUrl + '/admin/deleteRookieDefinition', formData, headersObj)
            .then(res => res.data);
    }

    async fetchRookieDefinitions(token: string) {
        return axios.get(this.baseUrl + '/admin/rookieDefinitions', { headers: { 'Authorization': 'Bearer ' + token } })
            .then(res => res.data);
    }

    async fetchUserInfo(token: string) {
        return axios.get(this.baseUrl + '/admin/users', { headers: { 'Authorization': 'Bearer ' + token } })
            .then(res => res.data);
    }

    async fetchRookieKeys(token: string) {
        return axios.get(this.baseUrl + '/rookies', { headers: { 'Authorization': 'Bearer ' + token } })
            .then(res => res.data);
    }
    
}

export default new ApiService();
