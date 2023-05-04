import { CanActivate, ExecutionContext } from "@nestjs/common";

export class Wait2fa implements CanActivate {
	canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		return request.session.waitingFor2fa;
	}
} 