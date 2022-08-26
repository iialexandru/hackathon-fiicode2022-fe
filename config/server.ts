export const dev: boolean = process.env.NODE_ENV !== 'production';

export const server: string = !dev ? 'http://localhost:9999' : 'https://inquisitive-frangollo-fc80ed.netlify.app'