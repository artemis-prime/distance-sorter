'use strict';

const sorter	= require("./distance-sorter");
const shuffle	= require("./array-shuffle");
const logger 	= require('@artemis-prime/logger').show();


const ashevilleData 	= require('./ashevillePoints.json');
const westside 			= {latitude: 35.578201, longitude: -82.592935};
const blackMountain 	= {latitude: 35.619101, longitude: 82.309313};

	/*
		returns projects array of projects (with all the properties present)
		1) *sorted* by distance from the supplied point.
		2) with the following properties added (all floats):
			distanceMeters
			distanceYards
			distanceMiles
			distanceKM
	*/

logger.log("////////////////////////////////////////////////////////////////")
logger.log("////////////////////////////////////////////////////////////////")
logger.newline();
let result = sorter.sort(westside, shuffle.shuffle(ashevilleData));
logger.dump("Sorted by distance from westside:", result);
logger.newline();
logger.log("////////////////////////////////////////////////////////////////")
logger.log("////////////////////////////////////////////////////////////////")
logger.newline();
result = sorter.sort(blackMountain, shuffle.shuffle(ashevilleData), 5);
logger.dump("Closest 5 sorted by distance from black mountain:", result);
logger.newline();
