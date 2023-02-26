const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
const dbpath = path.join(__dirname, "cricketTeam.db");
let db = null;
app.use(express.json());
const iniatiadbserver = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server started");
    });
  } catch (e) {
    console.log(`db error${e.message}`);
    process.exit(1);
  }
};
iniatiadbserver();
//API1
app.get("/players/", async (request, response) => {
  let query = `
    select *from 
    cricket_team;`;
  const players_details = await db.all(query);
  response.send(players_details);
});

//API2
app.post("/players/", async (request, response) => {
  let bodyy = request.body;
  let { player_name, jersey_number, role } = bodyy;
  let query = `
    insert into 
    cricket_team(playerName,jerseyNumber,role,playerId)
    values("${player_name}",${jersey_number},${role},30)`;
  let res = await db.run(query);
  response.send("Player Added to Team");
});
//API3
app.get("/players/:playerId/", async (request, response) => {
  let { player_id } = request.params;
  let query = `
    select *from cricket_team
    where player_id=${player_id}`;
  let res = await db.run(query);
  response.send(
    res.map((eachPlayer) => {
      convertDbObjectToResponseObject(eachPlayer);
    })
  );
});
//API4
app.put("/players/:playerId/", async (request, response) => {
  let { player_id } = request.params;
  let body = request.body;
  let { player_name, jersey_number, role } = body;
  let query = `
    update cricket_team
    set 
    player_name=${player_name},
    jersey_number=${jersey_number},
    role=${role}
    where 
    player_id=${player_id};
    `;
  let res = await db.run(query);
  response.send("Player Details Updated");
});

//API 5
app.delete("players/:playerId", async (request, response) => {
  let { player_id } = request.params;
  let query = `
    delete from 
    cricket_team
    where player_id=${player_id}`;
  let res = await db.run(query);
  response.send("Player Removed");
});
module.exports = app;

