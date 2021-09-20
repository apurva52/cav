
export function getURLParameterByName(name: string, url: string): string {

    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');

    name = name.replace(/[\[\]]/g, '\\$&');
    const results = regex.exec(url);

    if (!results) {
        return null;
    }

    if (!results[2]) {
        return '';
    }

    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
