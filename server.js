const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({
  path: './.env'
});

const { app } = require('./index');

const port = process.env.PORT;
const url = process.env.LOCAL_DB;
// const url = process.env.CLOUD_DB.replace('<db_password>', process.env.PASSWORD_DB);

mongoose.set("strictQuery" , false);
mongoose
  .connect(url)
  .then(() => {
    console.log('DATABASE Connected Successfully!');
    app.listen(port , () => {
      console.log(`Learnify Server Liseneing on port ${port}...`);
    });
  })
  .catch((error) => {
    console.log(`MONGODB ERROR:\n${error}`);
  });
