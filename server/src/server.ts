import httpServer from './app';
import { ENV } from './config/env';

const PORT = Number(ENV.PORT);

httpServer.listen(PORT, () => {
    console.log(`Server running on  in ${ENV.PORT} port`);
})