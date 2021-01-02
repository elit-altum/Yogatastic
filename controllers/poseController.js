// Controllers for yoga pose
const poses = require("../data/yoga_api_data.json");

// 0. Get random elements from an array
const getRandomElements = (arr) => {
	if (arr.length <= 5) {
		return arr;
	}

	const min = 0;
	const max = arr.length - 1;

	const takenIndexes = [];
	const randomArray = [];
	let size = 0;

	while (size < 5) {
		const randomIndex = Math.floor(Math.random() * (max - min + 1) + min);
		if (takenIndexes.includes(randomIndex)) {
			continue;
		}
		takenIndexes.push(randomIndex);
		randomArray.push(arr[randomIndex]);
		++size;
	}

	const sortObject = {
		beginner: -1,
		intermediate: 0,
		expert: 1,
	};

	const compareFunction = (a, b) => {
		const diffA = a.difficulty.toLowerCase();
		const diffB = b.difficulty.toLowerCase();

		return sortObject[diffA] - sortObject[diffB];
	};

	randomArray.sort(compareFunction);

	return randomArray;
};

// 1. Find matching poses
exports.findPose = (req, res) => {
	const { bodyArea, helpsWith, difficulty } = req.body;

	let responsePoses = [...poses];

	// 1. Check for body area
	if (bodyArea) {
		responsePoses = responsePoses.filter((pose) => {
			return pose.body_area.includes(bodyArea);
		});
	}

	// 2. Check for helpsWith
	if (helpsWith) {
		responsePoses = responsePoses.filter((pose) => {
			return pose.helps_with.includes(helpsWith);
		});
	}

	// 3. Check for difficulty
	if (difficulty) {
		responsePoses = responsePoses.filter((pose) => {
			return pose.difficulty === difficulty;
		});
	}

	// 4. Get random 5 elements
	responsePoses = getRandomElements(responsePoses);

	res.status(200).send({
		status: "success",
		results: responsePoses.length,
		data: {
			poses: responsePoses,
		},
	});
};
