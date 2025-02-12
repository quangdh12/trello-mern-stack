let apiRoot = ''

console.log('import.meta.env::', import.meta.env);

if (import.meta.env.MODE === 'development') {
    apiRoot = 'http://localhost:8017'
}
if (import.meta.env.MODE === 'production') {
    apiRoot = 'https://trello-api-tgma.onrender.com'
}


export const API_ROOT = apiRoot

