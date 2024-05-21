import { Measurement } from "../interfaces";

export function noMeasurementsSizes(currentSizes: string[], measurementUrls: Measurement[]): string[] {
	let sizes: string[] = []
	currentSizes.forEach(size => {
		let i = 0
		measurementUrls.forEach(measurement => {
			if (size === Object.keys(measurement)[0]) {
				i++
			}
		})
		if (i !== 1) {
			sizes.push(size)
		}
	})
	return sizes
}
