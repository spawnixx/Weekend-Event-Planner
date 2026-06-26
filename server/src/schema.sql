CREATE TABLE users (
    id SERIAL PRIMARY KEY,

    firstName VARCHAR(25) NOT NULL,
    lastName VARCHAR(25) NOT NULL,

    email VARCHAR(75) UNIQUE NOT NULL,

    password VARCHAR(255) NOT NULL
    groups INTEGER[] DEFAULT '{}'
);

CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,

    userIds INTEGER[] DEFAULT '{}', 
    owner_id INTEGER NOT NULL REFERENCES users(id),

    inviteCode VARCHAR(25) NOT NULL UNIQUE,
    
    confirmedEventIds INTEGER[] DEFAULT '{}'
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