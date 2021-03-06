/**
 * To-do for homework on 28 Jun 2018
 * =================================
 * 1. Create the relevant tables.sql file
 * 2. New routes for user-creation
 * 3. Change the pokemon form to add an input for user id such that the pokemon belongs to the user with that id
 * 4. (FURTHER) Add a drop-down menu of all users on the pokemon form
 * 5. (FURTHER) Add a types table and a pokemon-types table in your database, and create a seed.sql file inserting relevant data for these 2 tables. Note that a pokemon can have many types, and a type can have many pokemons.
 */

const express = require('express');
const methodOverride = require('method-override');
const pg = require('pg');
const sha256 = require('js-sha256');
const cookieParser = require('cookie-parser');


// Initialise postgres client
const config = {
  user: 'wenyaolee',
  host: '127.0.0.1',
  database: 'pokemons',
  port: 5432,
};

if (config.user === 'ck') {
	throw new Error("====== UPDATE YOUR DATABASE CONFIGURATION =======");
};

const pool = new pg.Pool(config);

pool.on('error', function (err) {
  console.log('Idle client error', err.message, err.stack);
});

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());


// Set react-views to be the default view engine
const reactEngine = require('express-react-views').createEngine();
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactEngine);

/**
 * ===================================
 * Route Handler Functions
 * ===================================
 */

 const getRoot = (request, response) => {
  // query database for all pokemon

  // respond with HTML page displaying all pokemon
  //
  const queryString = 'SELECT * from pokemon;';
  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('getRoot Query error:', err.stack);
    } else {
      console.log('Query result2:', result.rows);

      // redirect to home page
      response.render( 'home', {pokemon: result.rows} );
    }
  });
}

const getNew = (request, response) => {
  response.render('new');
}

const getPokemon = (request, response) => {
  let id = request.params['id'];
  const queryString = 'SELECT * FROM pokemon WHERE id = ' + id + ';';
  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('getNew Query error:', err.stack);
    } else {
      console.log('Query result:', result);

      // redirect to home page
      response.render( 'pokemon', {pokemon: result.rows[0]} );
    }
  });
}

const postPokemon = (request, response) => {
  let params = request.body;
  
  const queryString = 'INSERT INTO pokemon(id, num, name, img, height, weight) VALUES($1, $2, $3, $4, $5, $6);';
  const values = [params.id, params.num, params.name, params.img, params.height, params.weight];

  pool.query(queryString, values, (err, result) => {
    if (err) {
      console.log('postPokemon query error:', err.stack);
    } else {
      console.log('query result:', result);

      // redirect to home page
      response.redirect('/');
    }
  });
};

const editPokemonForm = (request, response) => {
  let id = request.params['id'];
  const queryString = 'SELECT * FROM pokemon WHERE id = ' + id + ';';
  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('editPokemon Query error:', err.stack);
    } else {
      console.log('Query result:', result);

      // redirect to home page
      response.render( 'edit', {pokemon: result.rows[0]} );
    }
  });
}

const updatePokemon = (request, response) => {
  let id = request.params['id'];
  let pokemon = request.body;
  const queryString = 'UPDATE "pokemon" SET "num"=($1), "name"=($2), "img"=($3), "height"=($4), "weight"=($5) WHERE "id"=($6)';
  const values = [pokemon.num, pokemon.name, pokemon.img, pokemon.height, pokemon.weight, id];
  console.log(queryString);
  pool.query(queryString, values, (err, result) => {
    if (err) {
      console.error('updatePokemon Query error:', err.stack);
    } else {
      console.log('Query result:', result);

      // redirect to home page
      response.redirect('/');
    }
  });
}

const deletePokemonForm = (request, response) => {
  let deletePokemonId = parseInt(request.params['id']);
  console.log('before query string ' + deletePokemonId);
  const queryString = `SELECT * FROM pokemon WHERE id = ${deletePokemonId}`;
  pool.query(queryString, (err, result) => {
    if(err) {
      console.error('deletePokemonFORM Query error', err.stack);
    } else {
      console.log('Query result:', result.rows[0])
      let content = {
      pokedex : result.rows[0]
    }  

      response.render('DeleteForm', content)
    }

  })
   //response.send("COMPLETE ME");
}

const deletePokemon = (request, response) => {
  let pokemonToDelete = parseInt(request.params['id']);
  const queryString = 'DELETE FROM pokemon WHERE id = '+pokemonToDelete

  pool.query(queryString, (err, result) => {
    if(err) {
      console.log('deletePokemon Query Query error', err.stack)
    } else {
      console.log('Query result: ', result)
      response.send('Pokemon Deleted');
    }
  }) 
}

const registrationForm = (request, response) => {
  response.render('registrationForm');
}

const registerUser = (request, response) => {
  let newUserName =  request.body['userName'];
  let hashedNewUserPassword = sha256(request.body['password']);
  let newUserEmail =  request.body['email'];
  response.cookie('regUser', newUserName);

  const queryString = `INSERT INTO users (user_name, password, email) VALUES ($1, $2, $3)`
  let values = [newUserName, hashedNewUserPassword, newUserEmail];

  pool.query(queryString, values, (err, result) => {
    if(err) {
      console.log('QUERY ERROR IN REGISTERING NEW USER', err.stack);
    } else {
      console.log('QUERY RESULT FOR REGISTERING NEW USER', result);
      response.send('New User Created');
    }
  })
}

const userLoginPage = (request, response) => {
  response.render('userLoginPage');
}

const logUserIn = (request, response) => {
  let loginUserName = request.body['loginUserName'];
  let hashedLoginUserPassword = sha256(request.body['loginPassword']);

  // compare user id and pw with the ones in database
  // get the data from database
  const queryString = `SELECT user_name, password FROM users`;
  pool.query(queryString, (err, result) => {
    if(err){
      console.log('QUERY ERROR IN RETRIEVING USER_NAME & PW', err.result);
    } else {
      console.log('QUERY RESULT FOR USER_NAME & PW FROM DATABASE', result);
      // console.log('QUERY RESULT FOR USER_NAME & PW FROM DATABASE', result.rows[0].password);
      // console.log('password entered during login. NOT FROM DATABASE ' + hashedLoginUserPassword);
      // console.log('QUERY RESULT FOR USER_NAME & PW FROM DATABASE', result.rows[0].user_name);
      // console.log('username entered during login. NOT FROM DATABASE ' +loginUserName);
      let dbUserName = result.rows[0].user_name;
      let dbPassword = result.rows[0].password;

      if ((loginUserName === dbUserName) && (hashedLoginUserPassword === dbPassword)) {
          response.redirect('/pokemon/user/user_home_page');
         }
         else if ((loginUserName != dbUserName) && (hashedLoginUserPassword === dbPassword)) {
          response.send('Enter a valid User Name');
         }
         else if ((loginUserName === dbUserName) && (hashedLoginUserPassword != dbPassword)) {
          response.send('Enter a valid Password');
         }
         else if ((loginUserName != dbUserName) && (hashedLoginUserPassword != dbPassword)) {
          response.send('Enter a valid User Name and Password');      
         }
         else if (!loginUserName && !hashedLoginUserPassword) {
          response.send('Enter your User Name and Password');
         }
    }
  })
}

const userHomePage = (request, response) => {
  const queryString = `SELECT user_name FROM users`;
  pool.query(queryString, (err, result) => {
    if(err){
      console.log('QUERY ERROR IN RETRIEVING USER_NAME', err.result);
    } else {
      console.log('QUERY RESULT FOR USER_NAME FROM DATABASE', result.rows[0].user_name);
      let context = {
        user: result.rows[0]
      }
        response.render('userHomePage', context);
  }
  })
}

/**
 * ===================================
 * Routes
 * ===================================
 */

app.get('/', getRoot);

app.get('/pokemon/:id/edit', editPokemonForm);
app.get('/pokemon/new', getNew);
app.get('/pokemon/:id', getPokemon);
app.get('/pokemon/:id/delete', deletePokemonForm);
app.get('/pokemon/user/registrationform', registrationForm);
app.get('/pokemon/user/login_page', userLoginPage);
app.get('/pokemon/user/user_home_page', userHomePage);


app.post('/pokemon', postPokemon);
app.post('/pokemon/user/registration', registerUser);
app.post('/pokemon/user', logUserIn);

app.put('/pokemon/:id', updatePokemon);

app.delete('/pokemon/:id', deletePokemon);

// TODO: New routes for creating users


/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
const server = app.listen(3000, () => console.log('~~~ Ahoy we go from the port of 3000!!!'));



// Handles CTRL-C shutdown
function shutDown() {
  console.log('Recalling all ships to harbour...');
  server.close(() => {
    console.log('... all ships returned...');
    pool.end(() => {
      console.log('... all loot turned in!');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);


