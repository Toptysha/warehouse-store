import { PhotoType } from "../interfaces"

interface PhotoTypes {
	COVER: PhotoType
	MEASUREMENTS: PhotoType
}

export const PHOTO_TYPES: PhotoTypes = {
	COVER: 'cover',
	MEASUREMENTS: 'measurements'
}
