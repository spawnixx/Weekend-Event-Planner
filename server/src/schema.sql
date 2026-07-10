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

    invite_code CHAR(8) NOT NULL UNIQUE,
    
);

CREATE TABLE group_members (
  userId INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  groupId INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  
  PRIMARY KEY (userId, groupId)
);


CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    groupId INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,

    title TEXT NOT NULL,

    startDate TIMESTAMP,
    endDate TIMESTAMP,

    location TEXT,
    latitude NUMERIC,
    longitude NUMERIC,

    googleMapsApiId VARCHAR,
    ticketmasterId VARCHAR,

    eventImageUrl TEXT,
    description TEXT,

    votingEnds TIMESTAMP,

    status TEXT NOT NULL DEFAULT 'proposed'
);

CREATE TABLE event_votes (
    eventId INTEGER REFERENCES events(id) ON DELETE CASCADE,
    userId INTEGER REFERENCES users(id) ON DELETE CASCADE,
    vote BOOLEAN NOT NULL,

    PRIMARY KEY (eventId, userId)
);