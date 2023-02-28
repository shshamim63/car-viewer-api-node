import express, {Request, Response} from 'express';

import { appConfig } from './config';

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${appConfig.port}`);
});