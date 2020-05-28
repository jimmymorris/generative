const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const load = require('load-asset');
const p5 = require('p5');

const settings = {
  dimensions: [2048, 1152],
  p5: { p5 },
  encoding: 'image/jpeg',
  encodingQuality: 1,
  pixelsPerInch: 300,
};

const colors = {
  DIRT: '#82735C',
  SKY: '#f5f5f5',
  GRASS: '#9CDE9F',
  NATS_RED: '#AB0003',
  NATS_BLUE: '#14225A',
  NATS_WHITE: '#FFF',
  HOU: '#EB6E1F',
  LAD: '#005A9C',
  STL: '#C41E3A',
  MIL: '#FFC52F',
}


/*

x = cx + r * cos(a)
y = cy + r * sin(a)

*/

const sketch = async () => {
  const statcast = await load('./nats-postseason-hits.json');
  const GRAVITY = 9.8;
  const toMetersPerSecond = (mph) => mph / 2.237;
  const ft2m = (ft) => ft / 3.281;
  const m2ft = (m) => m * 3.281;
  const initialHeight = 0;

  return ({ p5, context, width, height }) => {
    const startingX = 100;
    const endingX = width - 100
    const startingY = 100;
    const endingY = height - 100;

    const batOnBall = statcast.filter((atBat) => {
      const { hit_distance_sc, launch_angle } = atBat;
      return (
        !isNaN(parseFloat(launch_angle))
        && hit_distance_sc !== "null"
      )
    })
    const ball = [];

    context.fillStyle = colors.SKY;
    context.fillRect(0, 0, width, height);


    p5.noFill();
    for (let i = 0; i < batOnBall.length; i += 1) {
      const launchAngle = math.degToRad(parseFloat(batOnBall[i].launch_angle));
      const launchSpeed = toMetersPerSecond(parseFloat(batOnBall[i].launch_speed));

      const Vy = launchSpeed * Math.sin(launchAngle);
      const timeOfFlight = (Vy + Math.sqrt(Math.pow(Vy, 2) + 2 * GRAVITY * initialHeight)) / GRAVITY;
      const maxHeight = m2ft(initialHeight + (Math.pow(Vy, 2) / (GRAVITY * 2)));

      ball.push({
        timeOfFlight,
        maxHeight,
        inning: parseFloat(batOnBall[i].inning),
        range: parseFloat(batOnBall[i].hit_distance_sc),
        inning: parseFloat(batOnBall[i].inning),
        originalLaunchAngle: batOnBall[i].launch_angle,
        originalLaunchSpeed: batOnBall[i].launch_speed,
        convertedLaunchAngle: launchAngle,
        convertedLaunchSpeed: launchSpeed,
        opponent: batOnBall[i].home_team === 'WSH' ? batOnBall[i].away_team : batOnBall[i].home_team
      })
    }

    ball.sort((a, b) => a.range < b.range ? -1 : 1)

    const minRange = ball.reduce((min, l) => l.range < min ? l.range : min, ball[0].range);
    const maxRange = ball.reduce((max, l) => l.range > max ? l.range : max, ball[0].range);
    const minAirTime = ball.reduce((min, l) => l.timeOfFlight < min ? l.timeOfFlight : min, ball[0].timeOfFlight);
    const maxAirTime = ball.reduce((max, l) => l.timeOfFlight > max ? l.timeOfFlight : max, ball[0].timeOfFlight);
    const minHeight = ball.reduce((min, l) => l.maxHeight < min ? l.maxHeight : min, ball[0].maxHeight);
    const maxHeight = ball.reduce((max, l) => l.maxHeight > max ? l.maxHeight : max, ball[0].maxHeight);
    const pitcher = p5.map(60.5, 0, maxRange, startingX, endingX, true);
    const pitchersMound = p5.map(18 / 2, 0, maxRange, startingX, endingX, true);
    const battersBox = p5.map(27 / 2, 0, maxRange, startingX, endingX, true);

    ball.map((landing) => {
      console.log(landing.range)
      const landingX = p5.map(landing.range, 0, maxRange, startingX, endingX, true);
      const landingY = endingY;
      const halfWayPoint = (startingX + landingX) / 2;
      const peakY = p5.map(landing.maxHeight, 0, maxHeight, endingY, startingY, true);

      p5.noFill();
      p5.stroke(colors[landing.opponent]);
      p5.strokeWeight(2);
      p5.beginShape();
      p5.curveVertex(startingX, endingY);
      p5.curveVertex(startingX, endingY);
      p5.curveVertex((((startingX + halfWayPoint)) / 2), ((endingY + peakY) / 2))
      p5.curveVertex(halfWayPoint, peakY);
      p5.curveVertex(((halfWayPoint + landingX) / 2), ((endingY + peakY) / 2))
      p5.curveVertex(landingX, landingY)
      p5.curveVertex(landingX, landingY)
      p5.endShape();
    })

    p5.strokeWeight(20)
    p5.stroke(colors.DIRT);
    p5.line(0, endingY, width, endingY)
    p5.noStroke();
    p5.fill(colors.GRASS);
    p5.rect(0, endingY, width, endingY);

  };
};

canvasSketch(sketch, settings);
