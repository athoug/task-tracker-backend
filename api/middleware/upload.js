const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		// 'uploads/' is a folder at your project's root (make sure it exists)
		cb(null, 'uploads/');
	},
	filename: (req, file, cb) => {
		// e.g. avatar-1689958181263.png
		const ext = path.extname(file.originalname);
		const fileName = `avatar-${Date.now()}${ext}`;
		cb(null, fileName);
	},
});

const fileFilter = (req, file, cb) => {
	// Accept images only
	if (!file.mimetype.startsWith('image/')) {
		return cb(new Error('Only image files are allowed'), false);
	}
	cb(null, true);
};

const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 2 * 1024 * 1024, // 2 MB size limit (example)
	},
});

module.exports = upload;
