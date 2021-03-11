var MY_SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';
var slack = require('slack-notify')(MY_SLACK_WEBHOOK_URL);

class Slack {
  //***********************SIGNIN SLACK NOTIFY******************//
  static sendSignsUpNotification = (user) => {
    slack.success({
      text: 'new user signup',
      attachments: [
        {
          fields: [
            { title: 'Name', value: `${user.name}`, short: true },
            { title: 'Email', value: user.email, short: true },
          ]
        }
      ]
    });
  }

  static sendPostNotification = (user, content) => {
    slack.success({
      text: 'new user Post',
      attachments: [
        {
          fields: [
            { title: 'Name', value: `${user.name}`, short: true },
            { title: 'Email', value: user.email, short: true },
            { title: 'Content', value: `${content}`, short: true },
          ]
        }
      ]
    });
  }

  static sendCommentNotification = (user, content) => {
    slack.success({
      text: 'new user Comment',
      attachments: [
        {
          fields: [
            { title: 'Name', value: `${user.name}`, short: true },
            { title: 'Email', value: user.email, short: true },
            { title: 'Content', value: `${content}`, short: true },
          ]
        }
      ]
    });
  }
}
module.exports = Slack;
