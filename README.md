A library for clocking in and out at my job because I keep forgetting

After running `npm install`, run `npm run init` and it will create a file in the root dir called 'secrets.js'. Go into this file and input your username and password in the appropriate spots.

There are four scripts ready to go: clockIn, startBreak, endBreak, and clockOut. If you're on linux, you can schedule these with the cron utility (https://phoenixnap.com/kb/set-up-cron-job-linux). For other OS, use whatever scheduling utility is appropriate. V2 will include node-schedule (https://github.com/node-schedule/node-schedule) for scheduling, but release is tbd. There is some, but not a great deal, of error handling here, so for the first week or so keep an eye on your JW account to make sure everything is good to go.

Puppeteer uses a local cache to ensure that every time you open a new instance, you are using the same browser with the same cookies and local storage. If you ever need to reset this, just delete the 'localCache' directory and it will be re-generated the next time you run the program.
