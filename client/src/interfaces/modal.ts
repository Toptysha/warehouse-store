export interface Modal {
		isOpen: boolean,
		text: string,
		onConfirm: () => void,
		onCancel: () => void,
}
