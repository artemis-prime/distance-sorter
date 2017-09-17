'use strict'

const geolib = require('geolib')
const logger = require('@artemis-prime/logger'); //.show();

function getUsableSubset(orig) {
    let result = {
        proxy: [], 		// this is of the form need by geocode
        usableSet: [], 	// subset of original array indexed idently to proxy
    }
    for (let each of orig) {
		let location = usableLocation(each);
        if (location) {
	            // deep copy
	            //cf: https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
            result.usableSet.push(JSON.parse(JSON.stringify(each)))
            result.proxy.push(location)
        }
    }
    return result;
}

function usableLocation(obj) {
	let result = null;
	if (obj.hasOwnProperty('location')) {
		if (obj.location.hasOwnProperty('latitude') && obj.location.hasOwnProperty('longitude')) {
			result = {
				latitude: obj.location.latitude,
				longitude: obj.location.longitude,
			};
		}
		else if (obj.location.hasOwnProperty('lat') && obj.location.hasOwnProperty('long')) {
			result = {
				latitude: obj.location.lat,
				longitude: obj.location.long,
			};
		}
	}
	else if (obj.hasOwnProperty('loc')) {
		if (obj.loc.hasOwnProperty('latitude') && obj.loc.hasOwnProperty('longitude')) {
			result = {
				latitude: obj.loc.latitude,
				longitude: obj.loc.longitude,
			};
		}
		else if (obj.loc.hasOwnProperty('lat') && obj.loc.hasOwnProperty('long')) {
			result = {
				latitude: obj.loc.lat,
				longitude: obj.loc.long,
			};
		}
	}
	else if (obj.hasOwnProperty('latitude') && obj.hasOwnProperty('longitude')) {
		result = {
			latitude: obj.latitude,
			longitude: obj.longitude,
		};
	}
	else if (obj.hasOwnProperty('lat') && obj.hasOwnProperty('long')) {
		result = {
			latitude: obj.lat,
			longitude: obj.long,
		};
	}
	return result;
}

function sort(from, objectsArray, n = -1) {
    if (!from) {
        throw new Error("'from' location is null or undefined")
    }

    if (!objectsArray) {
        throw new Error("'objectsArray' array is null or undefined")
    }

    let parallelArrays = getUsableSubset(objectsArray)
    let indecesByDistance = geolib.orderByDistance(from, parallelArrays.proxy)

    let result = []
    if (n === -1) {
        n = parallelArrays.usableSet.length
    }
    for (let i = 0; i < n; i++) {
        let each = indecesByDistance[i]
        let obj = parallelArrays.usableSet[each.key]
        obj.distanceMeters = each.distance
        obj.distanceYards = geolib.convertUnit('yd', each.distance, 2)
        obj.distanceMiles = geolib.convertUnit('mi', each.distance, 2)
        obj.distanceKM = geolib.convertUnit('km', each.distance, 2)
        result.push(obj)
    }
    return result;
}

module.exports.sort = sort
