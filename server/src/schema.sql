CREATE TABLE users (
    id SERIAL PRIMARY KEY,

    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,

    email TEXT UNIQUE NOT NULL,

    password TEXT NOT NULL
);

CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
 
    owner_id INTEGER NOT NULL REFERENCES users(id),

    inviteCode CHAR(8) NOT NULL UNIQUE,
    
    confirmedEventIds INTEGER[] DEFAULT '{}'
);

CREATE TABLE group_members (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  
  PRIMARY KEY (user_id, group_id)
);


CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    groupId INTEGER NOT NULL REFERENCES groups(id),

    title VARCHAR NOT NULL,

    startDate DATE,
    endDate DATE,

    googleMapsApiId VARCHAR,
    ticketmasterId VARCHAR,

    eventImageUrl TEXT,
    description TEXT,

    votesFor INTEGER[] DEFAULT '{}',
    votesAgainst INTEGER[] DEFAULT '{}',

    votingEnds DATE,

    confirmed BOOLEAN DEFAULT FALSE
);