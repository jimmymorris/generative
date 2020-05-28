const canvasSketch = require('canvas-sketch');
const p5 = require('p5')
const Random = require('canvas-sketch-util/random')
const Delaunator = require('delaunator');

const settings = {
  dimensions: [1024, 1024],
  p5: { p5 }
};

const sketch = () => {
  const margin = 160;

  function calculateCentroids(points, delaunay) {
    const numTriangles = delaunay.halfedges.length / 3;
    let centroids = [];
    for (let t = 0; t < numTriangles; t++) {
      let sumOfX = 0, sumOfY = 0;
      for (let i = 0; i < 3; i++) {
        let s = 3 * t + i;
        let p = points[delaunay.triangles[s]];
        sumOfX += p.x;
        sumOfY += p.y;
      }
      centroids[t] = { x: sumOfX / 3, y: sumOfY / 3 };
    }
    return centroids;
  }

  function triangleOfEdge(e) { return Math.floor(e / 3); }
  function nextHalfedge(e) { return (e % 3 === 2) ? e - 2 : e + 1; }

  return ({ p5, context, width, height }) => {

    Random.setSeed(Random.getRandomSeed());

    const GRIDSIZE = 5;
    let points = [];

    for (let x = 0; x <= GRIDSIZE; x++) {
      for (let y = 0; y <= GRIDSIZE; y++) {
        points.push({
          x: p5.map(x, 0, GRIDSIZE, margin, width - margin, true),
          y: p5.map(y, 0, GRIDSIZE, margin, height - margin, true)
        })
      }
    }

    // points = points.map((point) => ({
    //   x: point.x + Random.noise2D(point.x, point.y, point.x, point.y),
    //   y: point.y + Random.noise2D(point.x, point.y, point.x, point.y)
    // }))

    let delaunay = Delaunator.from(points, loc => loc.x, loc => loc.y);

    let map = {
      points,
      numRegions: points.length,
      numTriangles: delaunay.halfedges.length / 3,
      numEdges: delaunay.halfedges.length,
      halfedges: delaunay.halfedges,
      triangles: delaunay.triangles,
      centers: calculateCentroids(points, delaunay)
    };

    p5.strokeWeight(10)

    p5.stroke('red');
    p5.strokeWeight(3);

    const coordinates = []

    for (let i = 0; i < map.triangles.length; i += 3) {
      coordinates.push([
        points[map.triangles[i]],
        points[map.triangles[i + 1]],
        points[map.triangles[i + 2]]
      ]);
    }

    for(let x = 0; x < coordinates.length; x += 1) {
      const trianglePoints = coordinates[x];
      for (let y = 0; y < trianglePoints.length; y += 1) {
        if (y < trianglePoints.length - 1) {
          p5.line(
            trianglePoints[y].x,
            trianglePoints[y].y,
            trianglePoints[y+1].x,
            trianglePoints[y+1].y
          );
        } else {
          p5.line(
            trianglePoints[y].x,
            trianglePoints[y].y,
            trianglePoints[0].x,
            trianglePoints[0].y
          );
        }
      }
    }

  }

};

canvasSketch(sketch, settings);
