/* ===== data.js – CricZone Live 2026 Data ===== */

const CricData = {

  matches: [
    {
      id: "m1", status: "live", type: "IPL 2026 – Match 22",
      team1: { name: "Mumbai Indians",   short: "MI",   flag: "🔵" },
      team2: { name: "Chennai Super Kings", short: "CSK", flag: "🟡" },
      score1: "192/4", overs1: "18.4", score2: "165/8", overs2: "20",
      venue: "Wankhede Stadium, Mumbai",
      summary: "MI need 28 off 8 balls",
      crr: "10.5", rrr: "21.0", battingTeam: 1,
      currentBatters: [
        { name: "Rohit Sharma",  runs: 72, balls: 44, fours: 7, sixes: 3, sr: "163.6" },
        { name: "Tilak Varma",   runs: 41, balls: 26, fours: 3, sixes: 2, sr: "157.7" }
      ],
      currentBowler: { name: "Matheesha Pathirana", overs: "3.4", runs: 28, wickets: 2, economy: "7.6" },
      commentary: [
        "18.4 | SIX! Rohit Sharma goes downtown – massive hit over long-on!",
        "18.3 | FOUR! Tilak whips it through mid-wicket. MI closing fast!",
        "18.2 | Dot. Good length ball defended back carefully.",
        "18.1 | Wide! Down the leg side. Extra run.",
        "18.0 | End of over 18. MI 182/4. Need 36 off 12.",
        "17.6 | WICKET! SKY caught at deep mid-wicket for 48. Big blow!",
        "17.5 | FOUR! Through the covers. Beautiful timing from Rohit."
      ],
      lastBalls: ["6","4","·","Wd","W","4","·"],
      batting: [
        { name: "Rohit Sharma",     runs: 72, balls: 44, fours: 7, sixes: 3, sr: "163.6", status: "batting" },
        { name: "Tilak Varma",      runs: 41, balls: 26, fours: 3, sixes: 2, sr: "157.7", status: "batting" },
        { name: "Ishan Kishan",     runs: 18, balls: 14, fours: 2, sixes: 0, sr: "128.6", status: "c Dhoni b Chahar" },
        { name: "Suryakumar Yadav", runs: 48, balls: 30, fours: 4, sixes: 2, sr: "160.0", status: "c Jadeja b Pathirana" },
        { name: "Hardik Pandya",    runs: 13, balls:  8, fours: 1, sixes: 1, sr: "162.5", status: "not out" }
      ],
      bowling: [
        { name: "Matheesha Pathirana", overs: "3.4", runs: 28, wickets: 2, economy: "7.6" },
        { name: "Deepak Chahar",       overs: "4",   runs: 38, wickets: 1, economy: "9.5" },
        { name: "Ravindra Jadeja",     overs: "4",   runs: 35, wickets: 1, economy: "8.75" },
        { name: "Dwayne Bravo",        overs: "4",   runs: 44, wickets: 0, economy: "11.0" },
        { name: "MS Dhoni",            overs: "0",   runs:  0, wickets: 0, economy: "0.0" }
      ]
    },
    {
      id: "m2", status: "live", type: "IPL 2026 – Match 22",
      team1: { name: "Royal Challengers Bengaluru", short: "RCB", flag: "🔴" },
      team2: { name: "Kolkata Knight Riders",       short: "KKR", flag: "🟣" },
      score1: "214/5", overs1: "20", score2: "156/9", overs2: "18.1",
      venue: "M Chinnaswamy Stadium, Bengaluru",
      summary: "KKR need 59 off 11 balls",
      crr: "8.6", rrr: "32.2", battingTeam: 2,
      currentBatters: [
        { name: "Andre Russell", runs: 35, balls: 18, fours: 2, sixes: 3, sr: "194.4" },
        { name: "Rinku Singh",   runs: 12, balls: 10, fours: 1, sixes: 0, sr: "120.0" }
      ],
      currentBowler: { name: "Mohammed Siraj", overs: "3.1", runs: 24, wickets: 3, economy: "7.5" },
      commentary: [
        "18.1 | SIX! Russell goes ballistic! KKR 156/9",
        "18.0 | WICKET! Venkatesh Iyer caught behind for 2.",
        "17.6 | WICKET! Shardul Thakur bowled middle stump.",
        "17.5 | FOUR! Russell through point."
      ],
      lastBalls: ["6","W","W","·","4","·"],
      batting: [
        { name: "Andre Russell",   runs: 35, balls: 18, fours: 2, sixes: 3, sr: "194.4", status: "batting" },
        { name: "Rinku Singh",     runs: 12, balls: 10, fours: 1, sixes: 0, sr: "120.0", status: "batting" },
        { name: "Shreyas Iyer",    runs: 42, balls: 28, fours: 4, sixes: 1, sr: "150.0", status: "c Kohli b Siraj" },
        { name: "Sunil Narine",    runs: 22, balls: 12, fours: 2, sixes: 1, sr: "183.3", status: "b Maxwell" }
      ],
      bowling: [
        { name: "Mohammed Siraj", overs: "3.1", runs: 24, wickets: 3, economy: "7.5" },
        { name: "Glenn Maxwell",  overs: "4",   runs: 30, wickets: 2, economy: "7.5" },
        { name: "Yash Dayal",     overs: "4",   runs: 40, wickets: 1, economy: "10.0" },
        { name: "Virat Kohli",    overs: "0",   runs:  0, wickets: 0, economy: "0.0" }
      ]
    },
    {
      id: "m3", status: "upcoming", type: "IPL 2026 – Match 23",
      team1: { name: "Rajasthan Royals", short: "RR",   flag: "🩷" },
      team2: { name: "Punjab Kings",     short: "PBKS", flag: "🔴" },
      score1: "—", overs1: "", score2: "—", overs2: "",
      venue: "Sawai Mansingh Stadium, Jaipur",
      summary: "Starts at 7:30 PM IST",
      crr: "—", rrr: "—", battingTeam: 0,
      commentary: [], lastBalls: [], batting: [], bowling: []
    },
    {
      id: "m4", status: "completed", type: "IPL 2026 – Match 21",
      team1: { name: "Delhi Capitals",     short: "DC",  flag: "🔵" },
      team2: { name: "Sunrisers Hyderabad", short: "SRH", flag: "🟠" },
      score1: "178/7", overs1: "20", score2: "181/4", overs2: "19.3",
      venue: "Arun Jaitley Stadium, Delhi",
      summary: "SRH won by 6 wickets",
      crr: "9.3", rrr: "—", battingTeam: 2,
      commentary: [], lastBalls: [],
      batting: [
        { name: "Travis Head",     runs: 82, balls: 48, fours: 8, sixes: 4, sr: "170.8", status: "not out" },
        { name: "Abhishek Sharma", runs: 44, balls: 28, fours: 4, sixes: 2, sr: "157.1", status: "c b Kuldeep" },
        { name: "Nitish Reddy",    runs: 32, balls: 20, fours: 2, sixes: 2, sr: "160.0", status: "not out" }
      ],
      bowling: [
        { name: "Kuldeep Yadav",  overs: "4", runs: 32, wickets: 2, economy: "8.0" },
        { name: "Axar Patel",     overs: "4", runs: 38, wickets: 1, economy: "9.5" },
        { name: "Anrich Nortje",  overs: "4", runs: 42, wickets: 1, economy: "10.5" }
      ]
    },
    {
      id: "m5", status: "upcoming", type: "IPL 2026 – Match 24",
      team1: { name: "Gujarat Titans",       short: "GT",  flag: "🔵" },
      team2: { name: "Lucknow Super Giants", short: "LSG", flag: "🟡" },
      score1: "—", overs1: "", score2: "—", overs2: "",
      venue: "Narendra Modi Stadium, Ahmedabad",
      summary: "Starts at 3:30 PM IST",
      crr: "—", rrr: "—", battingTeam: 0,
      commentary: [], lastBalls: [], batting: [], bowling: []
    },
    {
      id: "m6", status: "completed", type: "IPL 2026 – Match 20",
      team1: { name: "Kolkata Knight Riders", short: "KKR", flag: "🟣" },
      team2: { name: "Mumbai Indians",        short: "MI",  flag: "🔵" },
      score1: "195/5", overs1: "20", score2: "196/3", overs2: "19.2",
      venue: "Eden Gardens, Kolkata",
      summary: "MI won by 7 wickets",
      crr: "—", rrr: "—", battingTeam: 0,
      commentary: [], lastBalls: [],
      batting: [
        { name: "Rohit Sharma", runs: 95, balls: 52, fours: 9, sixes: 5, sr: "182.7", status: "not out" },
        { name: "Ishan Kishan", runs: 62, balls: 38, fours: 5, sixes: 3, sr: "163.2", status: "c Russell b Narine" }
      ],
      bowling: [
        { name: "Jasprit Bumrah", overs: "4", runs: 24, wickets: 2, economy: "6.0" },
        { name: "Trent Boult",   overs: "4", runs: 32, wickets: 1, economy: "8.0" }
      ]
    }
  ],

  tournaments: [
    {
      id: "ipl26", name: "TATA IPL 2026", format: "T20 – 10 Teams",
      flag: "🏆", className: "ipl",
      matches: 74, teams: 10, startDate: "Mar 22", endDate: "Jun 1",
      status: "ongoing", prizePool: "₹60 Cr"
    },
    {
      id: "ct26", name: "Champions Trophy 2026", format: "ODI – 8 Nations",
      flag: "🥇", className: "t20wc",
      matches: 15, teams: 8, startDate: "Jul 10", endDate: "Aug 2",
      status: "upcoming", prizePool: "$3M"
    },
    {
      id: "t20wc26", name: "ICC T20 World Cup 2026", format: "T20 – 20 Nations",
      flag: "🌍", className: "test",
      matches: 55, teams: 20, startDate: "Oct 12", endDate: "Nov 9",
      status: "upcoming", prizePool: "$2.45M"
    }
  ],

  schedule: [
    { date: "Apr 11", match: "MI vs CSK",   venue: "Wankhede, Mumbai",         status: "live",     type: "IPL 2026" },
    { date: "Apr 11", match: "RCB vs KKR",  venue: "Chinnaswamy, Bengaluru",   status: "live",     type: "IPL 2026" },
    { date: "Apr 12", match: "RR vs PBKS",  venue: "Sawai Mansingh, Jaipur",   status: "upcoming", type: "IPL 2026" },
    { date: "Apr 13", match: "GT vs LSG",   venue: "Narendra Modi, Ahmedabad", status: "upcoming", type: "IPL 2026" },
    { date: "Apr 14", match: "KKR vs CSK",  venue: "Eden Gardens, Kolkata",    status: "upcoming", type: "IPL 2026" },
    { date: "Apr 15", match: "DC vs SRH",   venue: "Arun Jaitley, Delhi",      status: "upcoming", type: "IPL 2026" },
    { date: "Apr 16", match: "MI vs RCB",   venue: "Wankhede, Mumbai",         status: "upcoming", type: "IPL 2026" }
  ],

  rankings: {
    batting: [
      { rank:1,  name:"Virat Kohli",        team:"RCB",  flag:"🇮🇳", mat:13, runs:712, avg:59.3, sr:"148.5", hundreds:3 },
      { rank:2,  name:"Rohit Sharma",       team:"MI",   flag:"🇮🇳", mat:12, runs:645, avg:53.8, sr:"155.2", hundreds:2 },
      { rank:3,  name:"Shubman Gill",       team:"GT",   flag:"🇮🇳", mat:13, runs:598, avg:49.8, sr:"142.1", hundreds:2 },
      { rank:4,  name:"KL Rahul",           team:"LSG",  flag:"🇮🇳", mat:12, runs:554, avg:50.4, sr:"138.5", hundreds:1 },
      { rank:5,  name:"Jos Buttler",        team:"RR",   flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", mat:11, runs:521, avg:47.4, sr:"162.8", hundreds:2 },
      { rank:6,  name:"Suryakumar Yadav",  team:"MI",   flag:"🇮🇳", mat:13, runs:502, avg:45.6, sr:"178.0", hundreds:1 },
      { rank:7,  name:"Travis Head",       team:"SRH",  flag:"🇦🇺", mat:12, runs:481, avg:44.0, sr:"169.0", hundreds:1 },
      { rank:8,  name:"David Warner",       team:"DC",   flag:"🇦🇺", mat:11, runs:451, avg:41.0, sr:"152.0", hundreds:1 },
      { rank:9,  name:"Rishabh Pant",       team:"DC",   flag:"🇮🇳", mat:12, runs:434, avg:39.5, sr:"171.0", hundreds:0 },
      { rank:10, name:"Faf du Plessis",     team:"RCB",  flag:"🇿🇦", mat:12, runs:412, avg:37.5, sr:"145.0", hundreds:1 }
    ],
    bowling: [
      { rank:1, name:"Jasprit Bumrah",        team:"MI",  flag:"🇮🇳", mat:13, wickets:28, avg:14.2, econ:"6.8",  sr:"12.5" },
      { rank:2, name:"Yuzvendra Chahal",      team:"RR",  flag:"🇮🇳", mat:13, wickets:24, avg:16.8, econ:"7.2",  sr:"14.0" },
      { rank:3, name:"Rashid Khan",           team:"GT",  flag:"🇦🇫", mat:12, wickets:22, avg:15.6, econ:"6.5",  sr:"13.6" },
      { rank:4, name:"Matheesha Pathirana",   team:"CSK", flag:"🇱🇰", mat:12, wickets:21, avg:16.1, econ:"7.0",  sr:"13.8" },
      { rank:5, name:"Mohammed Siraj",        team:"RCB", flag:"🇮🇳", mat:13, wickets:19, avg:18.2, econ:"7.8",  sr:"16.0" },
      { rank:6, name:"Trent Boult",           team:"MI",  flag:"🇳🇿", mat:11, wickets:18, avg:17.4, econ:"7.5",  sr:"14.8" },
      { rank:7, name:"Pat Cummins",           team:"SRH", flag:"🇦🇺", mat:11, wickets:17, avg:18.8, econ:"7.6",  sr:"15.5" },
      { rank:8, name:"Noor Ahmad",            team:"GT",  flag:"🇦🇫", mat:11, wickets:15, avg:20.1, econ:"7.2",  sr:"16.8" }
    ],
    allrounder: [
      { rank:1, name:"Hardik Pandya",   team:"MI",  flag:"🇮🇳", mat:12, runs:298, wickets:14, avg:32.0, econ:"8.2", sr:"152.0", hundreds:0 },
      { rank:2, name:"Andre Russell",   team:"KKR", flag:"🇯🇲", mat:11, runs:312, wickets:10, avg:38.0, econ:"9.1", sr:"180.0", hundreds:0 },
      { rank:3, name:"Ravindra Jadeja", team:"CSK", flag:"🇮🇳", mat:13, runs:256, wickets:12, avg:28.5, econ:"7.4", sr:"142.0", hundreds:0 },
      { rank:4, name:"Glenn Maxwell",   team:"RCB", flag:"🇦🇺", mat:12, runs:241, wickets:10, avg:30.1, econ:"7.8", sr:"155.0", hundreds:0 },
      { rank:5, name:"Nitish Reddy",    team:"SRH", flag:"🇮🇳", mat:11, runs:225, wickets:9,  avg:28.1, econ:"8.5", sr:"148.0", hundreds:0 }
    ]
  },

  purpleCap: { name: "Jasprit Bumrah",  team: "Mumbai Indians",             wickets: 28, flag: "🇮🇳" },
  orangeCap: { name: "Virat Kohli",     team: "Royal Challengers Bengaluru", runs: 712,  flag: "🇮🇳" },

  pollsDB: [
    { id:"p1", matchId:"m1", question:"Who hits the next SIX?",
      options:["Rohit Sharma","Tilak Varma","Hardik Pandya","No six this over"], correct:0, points:10 },
    { id:"p2", matchId:"m1", question:"Will MI win this match?",
      options:["Yes – easily","Yes – close finish","No – CSK holds on","Super Over"], correct:1, points:15 },
    { id:"p3", matchId:"m1", question:"How many runs in the next over?",
      options:["0–6 runs","7–12 runs","13–18 runs","19+ runs (max over)"], correct:3, points:20 },
    { id:"p4", matchId:"m2", question:"Who wins RCB vs KKR?",
      options:["RCB by 10+ runs","RCB close","KKR miracle","Abandoned"], correct:0, points:15 },
    { id:"p5", matchId:"m1", question:"Will Bumrah bowl the death over?",
      options:["Yes – 19th over","Yes – 20th over","No – another bowler","Match over before 20"], correct:1, points:12 }
  ],

  liveSim: {
    commentaryPool: [
      "FOUR! Driven beautifully through the covers – textbook cricket!",
      "SIX! Launches it high into the night sky – what a hit!",
      "WICKET! Edge goes straight to slip. Outstanding catch!",
      "Wide down the leg side. Batsman leaves it alone.",
      "Dot ball. Good length delivery, well defended back.",
      "Running between wickets – two runs taken very quickly.",
      "Caught at deep mid-wicket. That's a big scalp right there!",
      "No ball! Free hit coming up next delivery!",
      "FOUR through square leg! Wristy flick – outstanding batting!",
      "Appeal for LBW – Not Out! Umpire says no.",
      "SIX over long-on! That sailed way into the stands!",
      "MAIDEN OVER! Bowler completely on top right now.",
      "Review taken – ball tracking shows hitting off stump!",
      "FIFTY up for the batsman! Raises the bat to the crowd.",
      "HUNDRED! What a knock – the stadium is on its feet!",
      "BOUNDARY! Well placed – couldn't have hit it any better.",
      "New batter in – pressure is on immediately.",
      "That swung late! Beaten on the outside edge – so close!"
    ]
  }
};

window.CricData = CricData;
