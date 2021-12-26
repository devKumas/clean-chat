import express from 'express';
import morgan from 'morgan';
import { sequelize } from './models';
const { PORT } = process.env;

const app = express();

sequelize
  .sync({ force: true })
  .then(() => console.log('데이터베이스 연결'))
  .catch(console.error);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('port', PORT || 8000);

app.get('/', (req, res) => {
  res.json({ message: 'hello world' });
});

app.listen(app.get('port'), () => {
  console.log(`HTTP Server Started Port ${app.get('port')}`);
});
