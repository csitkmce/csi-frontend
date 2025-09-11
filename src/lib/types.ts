export type Student = {
	id: number;
	user: {
		id: number;
		email: string;
		is_staff: boolean;
		is_superuser: boolean;
		date_joined: string;
	};
	name: string;
	phone_number: string;
	department: string;
	batch: string;
	year: number;
};

export type User = {
	name: string;
	email: string;
	department: string;
	batch: string;
	year: string;
};

export type UserDataRow = {
	status: boolean;
	id: number;
	name: string;
	email: string;
	phone_number: string;
	department: string;
	batch: string;
	year: number;
	role: string;
};

export type Event = {
	id: number;
	name: string;
	description: string;
	image: string;
	venue: string;
	eventStartDate: string;
	eventStartTime: string;
	eventEndDate: string;
	eventEndTime: string;
	regOpen: boolean;
	isRegistrationFull: boolean;
	regStartDate: string;
	regStartTime: string;
	regEndDate: string;
	regEndTime: string;
	durationDays: number;
	fee: string;
	food: string;
	team: {
		min: number;
		max: number;
	};
	teamCode?: string;
	maxRegistrations?: number;
  	whatsappLink?: string;	
	certificateUrl?: string;
};

export type ExecomMember = {
	name: string;
	year: number;
	academic_year: number;
	batch: string;
	role: string;
	upload_image: string;
	social_link: string;
};

export type LeaderBoard = {
	rank: number;
	name: string;
	points: number;
};

export type ExecomList = Record<string, ExecomMember[]>;
export type EventList = Record<string, Event[]>;

export type LoadedData<T> = LoadingPending | LoadingSuccess<T> | LoadingFailure;

type LoadingSuccess<T> = {
	state: 'success';
	data: T;
};

type LoadingPending = {
	state: 'pending';
	message: string;
};

type LoadingFailure = {
	state: 'failed';
	message: string;
};
