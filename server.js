const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');




const sequelize = require('./config/connection');
const routes = require("./routes");

const { User } = require('./models');



const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3001;


app.use(routes);





sequelize.authenticate()
  .then(() => {
    console.log('✅ The database connection was successfully established.');
    return sequelize.sync({ force: false });
  })
  .then(() => {
    console.log('✅ Database synced.');
    app.listen(PORT, () => {
      console.log(`🚀 The server is running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Could not connect to the database:', err);
  });