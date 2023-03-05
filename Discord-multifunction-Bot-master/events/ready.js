module.exports = client => {
  console.log("The bot is ready!");
  (async function () {
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    };
    answered1 = true;
    answered2 = true;
    answered3 = true;
    userAnswer1 = "";
    userAnswer2 = "";
    userAnswer3 = "";
    var i = 0;
    while (i < 10) {
      client.user.setPresence({
        activity: {
          name: '환영합니다.'
        },
        status: 'dnd'
      })
      await sleep(5000)
      client.user.setPresence({
        activity: {
          name: `방문해주셔서 감사합니다!`
        },
        status: 'dnd'
      })
      await sleep(5000)
    }
  })();
}
