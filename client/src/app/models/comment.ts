export class Comment{
	constructor(
		public _id: string,
		public user: string,
		public publication: string,
		public text: string,
		public created_at: string
	){}
}