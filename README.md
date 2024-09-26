#### Requirements

- [Docker and Docker-Compose](https://www.docker.com/)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)
- [Node.js and NVM](https://nodejs.org/en/download/package-manager)

#### To get the Backend up and running

1. `cd server`
2. prepare .env file  
    1. create a file in the server folder named `.env`  
    2. copy the contents from .env.example into .env
    3. edit environmental variables as needed. You'll need valid Alpaca Broker and Market API keys in the .env file.
3. `yarn install`
4. `yarn setup`
5. `yarn start`
#### To get the Client up and running

1. `cd client`
1. `yarn install` 
1. `yarn dev`

The client will be available at port "http://localhost:5173". 
  
The REST API will be available at port 3000. The WebSocket stream will be available at port 8080, and the database will be available at port 5432  
  
Real live market data will only be streamed while the stock market is open. If you want to run a simulation of the stock market instead, set MOCK_ALPACA_WEBSOCKETS=true in the backend .env file  

Only 30 stock symbols can be watched at a time(a limit imposed by Alpaca's free tier)
