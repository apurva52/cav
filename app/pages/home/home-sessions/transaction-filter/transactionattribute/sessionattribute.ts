

export class SessionAttribute  {

	nvSessionId: string;
	channel: string;
        page: string;
        browser: string;
        os:FilterWithVersion[];
        location: string;
        device: string;
        platform: string;
        clientip:string;

        entrypage: string;
        exitpage: string;
	containingPage: string;
	nonContainingPage: string;

	getChannel(): string {
                return this.channel;
        }
        setChannel(channel: string) {
                channel = this.channel;
        }
        getPage(): string {
                return this.page;
        }
        setPage(page: string) {
                page = this.page;
        }
        getBrowser(): string {
                return this.browser;
        }
        setBrowser(browser: string) {
                browser = this.browser;
        }
        getLocation(): string {
                return this.location;
        }
        setLocation(location: string) {
                location = this.location;
        }
        getDevice(): string {
                return this.device;
        }
        setDevice(device: string) {
                device = this.device;
        }
        getPlatform(): string {
                return this.platform;
	}
	setPlatform(platform: string) {
                platform = this.platform;
        }


}


export class FilterWithVersion
{
    version: string;
    name: string;
}

