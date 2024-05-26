import { Modal } from "./modal"

export interface Store {
	app: {
		headerNameMenuDisplay: boolean,
		loader: boolean,
		modal: Modal
	},
	user: {
		id: string | null,
		login: string | null,
		roleId: string | null,
		session: string | null,
	},
	error: {error: string}
}
