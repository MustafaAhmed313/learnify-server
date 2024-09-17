const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({
  path: './.env'
});

const { app } = require('./index');

const port = process.env.PORT;
let url ='';
if (process.env.NODE_ENV === 'production') {
  url = process.env.CLOUD_DB.replace('<db_password>', process.env.PASSWORD_DB);
}else {
  url = process.env.LOCAL_DB;
}


mongoose.set("strictQuery" , false);
mongoose
  .connect(url)
  .then(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('LOCAL DATABASE Connected Successfully!');
    }else {
      console.log('CLOUD DATABASE Connected Successfully!')
    }
    app.listen(port , () => {
      console.log(`Learnify Server Liseneing on port ${port}...`);
    });
  })
  .catch((error) => {
    console.log(`MONGODB ERROR:\n${error}`);
  });
