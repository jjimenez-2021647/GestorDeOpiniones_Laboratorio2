import dotenv from 'dotenv';
import { initServer} from './configs/apps.js';

dotenv.config();

process.on('uncaughtException', (err) =>{
    console.error('Uncaught Exception in Gestor de Opiniones Server:', err);
    process.exit(1);
})
process.on('unhandledRejection', (err, promise) =>{
    console.error('Unhandled Rejection at:', promise, 'reason:', err);
    process.exit(1);
})

console.log('Starting Gestor de Opiniones Server...');
initServer();