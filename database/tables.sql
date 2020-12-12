create table users (
  googleID VARCHAR(128) PRIMARY KEY,
  firstname VARCHAR(64),
  lastname VARCHAR(64),
  email VARCHAR(128),
  lang VARCHAR(2),
  refresh_token VARCHAR(128)
);