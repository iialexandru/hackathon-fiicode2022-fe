export const dev: boolean = process.env.NODE_ENV !== 'production';

export const server: string = dev ? 'http://localhost:9999' : 'https://hackathon-server-fiicode.herokuapp.com'

export const client: string = dev ? 'http://localhost:3000' : ''