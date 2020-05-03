const mSDK = require('matrix-js-sdk');

const BOT_ID = process.env.MATRIX_USER_ID || '@westend_faucet:matrix.org';

const mbot = mSDK.createClient({
  baseUrl: 'https://matrix.org',
  accessToken: process.env.MATRIX_ACCESS_TOKEN,
  userId: process.env.MATRIX_USER_ID,
  localTimeoutMs: 10000,
});

exports.start = function (ghost) {
  mbot.on('RoomMember.membership', (_, member) => {
    if (member.membership === 'invite' && member.userId === BOT_ID) {
      mbot.joinRoom(member.roomId).done(() => {
        console.log(`Auto-joined ${member.roomId}.`);
      });
    }
  });
  
  mbot.on('Room.timeline', async (event) => {
    if (event.getType() !== 'm.room.message') {
      return; // Only act on messages (for now).
    }
  
    const { content: { body }, event_id: eventId, room_id: roomId, sender } = event.event;
    console.warn(roomId, sender, body);

    const bot = {
      formatCommand (cmd) {
        return `!${cmd}`;
      },
      sender,
      async sendMessage (msg) {
        await mbot.sendEvent(
          roomId, 'm.room.message', { 'body': msg, 'msgtype': 'm.text' },
          '', console.error);
      },
      async sendHtmlMessage(msg) {
        await mbot.sendHtmlMessage(roomId, msg);
      }
    };
  
    const cmds = body.split(' ').map(s => s.trim());
    if (!cmds) return;

    const action = cmds[0];
    const args = cmds.slice(1);

    if (action in ghost) {
      await ghost[actin](bot, args);
    } else {
      console.log('Matrix bot: unknown cmd', cmd, args);
    }
  });

  mbot.startClient(0);
}