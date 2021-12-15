# zoom-integration
Zoom Integration Application

## Objective:

- Create a backend application to authenticate Zoom users using OAuth
- Integrate zoom APIs on the backend to authenticate user, get all recording lists and download the recording
- Allow the user to revoke the access.
- Store necessary data in the single database to reauthenticate users from their accessToken and get the refreshToken (if required)
- On the frontend - we need just a vanilla page (with the authentication button), and once the user is authenticated, display all the recordings in a single table (check the column list below)
- You will get access to the Zoom app store with the required information.

## Tech Stack:

- Angular (version 11)
- Node.js (version 12)
- Typescript (version 4.3.5)
- Mongodb (version 4)


## Timeline:

- 24th Sep - Authorization for Zoom
- 27th Sep - Display in table - Download option

## Workflow:

- Create simple nodejs, angular project
- Database is MongoDB
- Allow the download option

## Credentials:

- Client ID: `vfN964W2QCxuWwr4XWoA`
- Client Secret: `wA8IecF0UjXTPpHvva95d8nq3gdEGsVJ`
- Redirect URL for OAuth: `http://localhost:8081/integrations/zoom`

## Reference links:

- https://marketplace.zoom.us/docs/guides


# Zoom oAuth Reference links:
https://marketplace.zoom.us/docs/guides/auth/oauth


# Project Setup
# web
npm i
npm run start

# server
npm i
npm run start

# serverDevelopment mode
npm run dev
