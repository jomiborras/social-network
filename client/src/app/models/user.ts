export class User{
	constructor(
		public _id: string,
		public name: string,
		public last_name: string,
		public nick_name: string,
		public email: string,
		public password: string,
		public role: string,
		public image: string
	){}
}