# Gym App

Gympass style app

## Functional Requirements

- [x] Should be possible to register;
- [x] Should be possible to authenticate;
- [x] Should be possible to get logged user profile information;
- [] Should be possible to obtain the total check-in quantity of the logged user;
- [] Should be possible to the user to get his check-in history;
- [] Should be possible to get the closest gyms;
- [] Should be possible to search for gyms by their name;
- [] Should be possible to the user to do a check-in operation in a gym;
- [] Should be possible to validate user check-in;
- [] Should be possible to register a gym;

## Business Rules

- [x] User cant register with a duplicate email address;
- [] User cant do 2 check-ins in the same day;
- [] User cant do a check-in operation if he's close (100mts) to the gym;
- [] Check-in can only be validated until after 20 minutes after creation;
- [] Check-in can only be validated by admins;
- [] Gym can only be registered by admins;

## Non-Functional Requirements

- [x] User's password must be cryptographed;
- [x] Application data must be persisted on a PostgreSQL database;
- [] All data lists must be paginated with 20 items per page;
- [] User must be identified by a JWT token (JSON Web Token);
