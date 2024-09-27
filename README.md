#### Stock Dashboard
A full-stack application that allows you to maintain a list of stocks, and get live updates to their prices. Uses https://alpaca.markets/ for market data.


https://github.com/user-attachments/assets/2a72b64c-737f-4407-84b5-94820c0dc228


#### Requirements

- [Docker and Docker-Compose](https://www.docker.com/)
- [Node.js and NVM](https://nodejs.org/en/download/package-manager)
- [Yarn](https://yarnpkg.com/getting-started/install)

#### To get the Backend up and running

1. `cd server`
1. `nvm use`
1. prepare .env file  
    1. create a file in the server folder named `.env`  
    1. copy the contents from `.env.example` into `.env`
    1. edit environmental variables as needed. You'll need valid Alpaca Broker and Market API keys in the `.env` file.
1. `yarn install`
1. `yarn setup`
1. `yarn start`  
  
The REST API will be available at port 3000. The WebSocket stream will be available at port 8080, and the database will be available at port 5432 

#### To get the Client up and running

1. `cd client`
1. `nvm use`
1. `yarn install` 
1. `yarn docker:up`
1. `yarn db:migrate`
1. `yarn db:seed`
1. `yarn dev`

The client will be available at "http://localhost:5173". While both the server and client are running, navigating to that url in a web browser will show the dashboard
  
#### Misc
You can run `yarn docker:down` to get stop the docker container containing Postgres, or `yarn docker:down -v` to remove both Postgres and the volume it uses
  
Real live market data will only be streamed while the stock market is open. If you want to run a simulation of the stock market instead, set `MOCK_ALPACA_WEBSOCKETS=true` in the backend .env file  

Only 30 stock symbols can be watched at a time(a limit imposed by Alpaca's free tier)  

The UI is pretty minimal. If I spent more time on this, I would definitely look into improving it, especially the symbol chooser. Maybe add support for multiple users/watchlists too.  

I'd normally use NestJS for back-ends, but this was a good opportunity to derust my plain Express skills.
