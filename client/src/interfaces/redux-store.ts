import { Modal } from "./modal"

export interface Store {
	app: {
		headerNameMenuDisplay: boolean,
		modal: Modal
	},
	user: {
		id: string | null,
		login: string | null,
		roleId: number | null,
		session: string | null,
	}
}
