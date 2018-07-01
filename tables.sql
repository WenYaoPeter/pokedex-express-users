CREATE TABLE IF NOT EXISTS pokemon (
	id SERIAL PRIMARY KEY,
	num integer,
	name TEXT,
	img varchar(255), 
	height varchar(255),
	weight varchar(255),
	candy varchar(255),
	candy_count integer,
	egg varchar(255),
	avg_spawns integer,
	spawn_time varchar(255)
);


CREATE TABLE IF NOT EXISTS users (
	id SERIAL PRIMARY KEY,
	use_name TEXT,
	password varchar(255)
);