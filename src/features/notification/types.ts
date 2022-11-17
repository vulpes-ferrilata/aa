export type Notification = {
	id: string;
	type: NotificationType;
	detail: string;  
};

export enum NotificationType {
	Info = "Info",
	Success = "Success",
	Warning = "Warning",
	Error = "Error",
};

export namespace NotificationType {
	export function toBackgroundColor(notificationType: NotificationType): string {
		switch (notificationType) {
			case NotificationType.Info:
				return "bg-blue-600";
			case NotificationType.Success:
				return "bg-green-600";
			case NotificationType.Warning:
				return "bg-yellow-600";
			case NotificationType.Error:
				return "bg-red-600";
		}
	}
}