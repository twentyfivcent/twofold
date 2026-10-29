# TWOFOLD

An original 2v2 browser FPS. Everyone in a match shares the same loadout; the first team to win 6 rounds takes the match. Empty slots are filled by bots, so you can play with one friend or a full lobby. Solo practice is available from the menu.

**Play:** [https://twentyfivcent.github.io/twofold/](https://twentyfivcent.github.io/twofold/)

The page is a single `index.html`. It loads three.js and PeerJS from unpkg. Online matches connect peer-to-peer; no game server is involved.

v4 adds new guns and utilities, six three-lane maps (Dockyard 9, Sunspire Roof, Dustbowl Outpost, Glasshouse Atrium, Frostline Depot, and Greywater Keep), walled spawns, hitboxes, recoil, scopes, loadout voting, spectating, a damage recap, sound, textures, smarter bots, and a crosshair menu. While you are dead, click or Space cycles the player you watch, and F switches to a free camera.

## Host a match

1. Open the game and set your name.
2. Choose a map (or leave it on Random) and click **Host Online Match**.
3. The lobby shows a 5-letter room code. Click **Copy** and send that code to the other players.
4. Wait for them to appear in the lobby. Use **Switch Team** if you want to change sides. Open slots stay bots.
5. Click **Start Match**.

Keep the tab open. If you leave, the room closes.

## Join with a room code

1. Open the game and set your name.
2. Type the host's 5-letter code into the code box and click **Join** (or press Enter).
3. You land in the lobby and wait until the host starts the match.

Codes use letters only (no I or O). If the game says there is no room with that code, ask the host to confirm they are still in the lobby.

If a friend cannot connect (strict NAT or firewall), both of you can open **Relay server** on the menu, save the same TURN settings, and try the code again.
