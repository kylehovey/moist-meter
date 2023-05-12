const { Client, Intents } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Store the playing time for each member
const playingTime = new Map();

client.once("ready", () => {
  console.log("Bot is ready!");
});

client.on("messageCreate", (message) => {
  if (message.content.startsWith("!moisture")) {
    // Create the scoreboard
    const scoreboard = generateScoreboard();

    // Send the scoreboard as a message
    message.channel.send(scoreboard);
  }
});

client.on("presenceUpdate", (oldPresence, newPresence) => {
  const member = newPresence.member;

  // Check if the member is playing Risk of Rain 2
  const isPlayingRiskOfRain2 = newPresence.activities.some(
    (activity) =>
      activity.name === "Risk of Rain 2" && activity.type === "PLAYING"
  );

  if (isPlayingRiskOfRain2) {
    // Calculate the playing time for the member
    const startTime = newPresence.activities.find(
      (activity) =>
        activity.name === "Risk of Rain 2" && activity.type === "PLAYING"
    ).timestamps.start;

    const currentTime = new Date();
    const playingHours = (currentTime - startTime) / (1000 * 60 * 60);

    // Update the playing time for the member
    playingTime.set(member.id, playingHours.toFixed(1));
  }
});

function generateScoreboard() {
  let scoreboard = "```";
  scoreboard += "Username........ | Playing Time | Difficulty\n";

  // Sort members by playing time in descending order
  const sortedMembers = [...playingTime.entries()].sort((a, b) => b[1] - a[1]);

  for (const [memberId, playingHours] of sortedMembers) {
    const member = client.guilds.cache
      .get("YOUR_SERVER_ID")
      .members.cache.get(memberId);
    const username = member ? member.user.username : "Unknown";

    // Fetch the difficulty based on playing time
    let difficulty = "Unknown";
    if (playingHours >= 25) {
      difficulty = "Monsoon";
    } else if (playingHours >= 10) {
      difficulty = "Rainstorm";
    } else {
      difficulty = "Drizzle";
    }

    scoreboard += `${username.padEnd(16, ".")} | ${playingHours
      .toString()
      .padStart(6)}h | ${difficulty}\n`;
  }

  scoreboard += "```";
  return scoreboard;
}

client.login("YOUR_BOT_TOKEN");
